import { Thread } from './thread.entity.js';
import { CommentsService } from '../comments/comments.service.js';
import type { Comment } from '../comments/comment.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, FindOptionsWhere } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { CreateCommentDto } from '../comments/dto/create-comment.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';

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

const sampleThreads: CreateThreadDto[] = [
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
export class ThreadsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
    private readonly commentsService: CommentsService,
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    // LEARN: without the tables (migrations not run), SQLite only says
    // "no such table: threads". The app still crashes, but with a hint for
    // humans. `cause` keeps the original error, so nothing gets lost.
    try {
      if ((await this.threadRepository.count()) > 0) return;
      await this.threadRepository.save(
        this.threadRepository.create(sampleThreads),
      );
    } catch (error) {
      throw new Error(
        'Could not seed the sample threads. Did you run "npm run migration:run"?',
        { cause: error },
      );
    }
  }

  async findAll(
    author?: string, 
    since?: Date
  ): Promise<(Thread & { commentCount: number })[]> {
    const where: FindOptionsWhere<Thread> = {};
    if (author !== undefined) where.author = author;
    if (since !== undefined) where.createdAt = MoreThanOrEqual(since);

    const threads = await this.threadRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      threads.map(async (thread) => ({
        ...thread,
        commentCount: await this.commentsService.countByThread(thread.id),
      })),
    );
  }

  async findById(id: string): Promise<Thread> {
    const thread = await this.threadRepository.findOne({
      where: { id },
      relations: { comments: true },
      order: { comments: { createdAt: 'ASC' } },
    });
    if (!thread) {
      throw new NotFoundException(`Thread with ID ${id} NOT found.`);
    }
    return thread;
  }

  async create(payload: CreateThreadDto): Promise<Thread> {
    const thread = this.threadRepository.create({
      title: payload.title,
      author: payload.author,
      body: payload.body,
    });
    return this.threadRepository.save(thread);
  }

  async update(id: string, dto: UpdateThreadDto): Promise<Thread> {
    const thread = await this.threadRepository.findOneBy({ id });
    if (!thread) {
      throw new NotFoundException(`Thread with ID ${id} NOT found.`);
    }
    this.threadRepository.merge(thread, dto);
    return this.threadRepository.save(thread);
  }

  async addComment(
    threadId: string,
    payload: CreateCommentDto,
  ): Promise<Comment> {
    await this.findById(threadId);
    return this.commentsService.create(threadId, payload);
  }

  async remove(id: string): Promise<void> {
    const result = await this.threadRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Thread with ID ${id} NOT found.`);
    }
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
