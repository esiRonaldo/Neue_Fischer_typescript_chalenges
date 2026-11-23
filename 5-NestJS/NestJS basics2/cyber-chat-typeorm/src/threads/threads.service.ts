import { Thread, type ThreadPayload, type ThreadChanges } from './thread.entity.js';
import { CommentsService } from '../comments/comments.service.js';
import type { Comment, CommentPayload } from '../comments/comment.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';

type AuthorStat = {
  author: string;
  threads: number;
};

function byMostThreadsThenName(a: AuthorStat, b: AuthorStat): number {
  return b.threads - a.threads || a.author.localeCompare(b.author);
}

function sortByMostThreads(stats: readonly AuthorStat[]): AuthorStat[] {
  return stats.toSorted(byMostThreadsThenName);
}

const sampleThreads: ThreadPayload[] = [
  {
    title: 'Tabs or spaces, final answer?',
    author: 'pixelpirate',
    body: 'My team argues about this in every code review. What does your formatter do?',
  },
  {
    title: 'Is SQLite enough for a side project?',
    author: 'neonbyte',
    body: 'I expect maybe a hundred users. Do I really need a database server?',
  },
];

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
    private readonly commentsService: CommentsService
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    if ((await this.threadRepository.count()) > 0) return;
    await this.threadRepository.save(this.threadRepository.create(sampleThreads));
  }

  async findAll(author?: string): Promise<(Thread & { commentCount: number })[]> {
    const threads = await this.threadRepository.find({
      where: author === undefined ? {} : { author },
      order: { createdAt: 'DESC' },
    });

    return threads.map(thread => ({
      ...thread, commentCount: this.commentsService.countByThread(thread.id)
    }));
  }

  async findById(id: string): Promise<Thread & { comments: Comment[] }> {
    const thread = await this.threadRepository.findOneBy({ id });
    if (!thread) {
      throw new NotFoundException(`Thread with ID ${id} NOT found.`);
    }
    return { ...thread, comments: this.commentsService.findByThread(id) };
  }

  async create(payload: ThreadPayload): Promise<Thread> {
    const thread = this.threadRepository.create({
      title: payload.title,
      author: payload.author,
      body: payload.body,
    });
    return this.threadRepository.save(thread);
  }

  async update(id: string, payload: ThreadChanges): Promise<Thread> {
    const changes: ThreadChanges = {}
    if (payload.title !== undefined) changes.title = payload.title
    if (payload.body !== undefined) changes.body = payload.body

    const thread = await this.threadRepository.findOneBy({ id });
    if (!thread) {
      throw new NotFoundException(`Thread with ID ${id} NOT found.`)
    }
    return this.threadRepository.save({ ...thread, ...changes })
  }

  async addComment(threadId: string, payload: CommentPayload): Promise<Comment> {
    await this.findById(threadId)
    return this.commentsService.create(threadId, payload)
  }

  async remove(id: string): Promise<void> {
    const result = await this.threadRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Thread with ID ${id} NOT found.`);
    }
    this.commentsService.deleteByThread(id);
  }

  async getAuthorStats(): Promise<AuthorStat[]> {
    const counts = new Map<string, number>();

    for (const thread of await this.threadRepository.find()) {
      const current = counts.get(thread.author) ?? 0;
      counts.set(thread.author, current + 1);
    }

    const result = Array.from(counts, ([author, threads]) => ({
      author,
      threads,
    }));

    return sortByMostThreads(result);
  }
}
