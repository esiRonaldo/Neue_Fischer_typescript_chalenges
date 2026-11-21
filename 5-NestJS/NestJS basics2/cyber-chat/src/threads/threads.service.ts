import { Injectable, NotFoundException } from '@nestjs/common';
import type { Thread, ThreadPayload } from './thread.js';
import { ThreadsRepository } from './threads.repository.js';
import { CommentsService } from '../comments/comments.service.js';
import type { Comment, CommentPayload } from '../comments/comment.js';


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

function sortNewestFirst(threads: readonly Thread[]): Thread[] {
  return threads.toSorted(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

@Injectable()
export class ThreadsService {
  constructor(
    private readonly threadRepository: ThreadsRepository,
    private readonly commentsService: CommentsService
  ) { }

  findAll(author?: string): Thread[] {
    const allThreads = this.threadRepository.findAll();
    const threads =
      author === undefined
        ? allThreads
        : allThreads.filter((thread) => thread.author === author);

    return sortNewestFirst(threads);
  }

  findById(id: string): Thread & { comments: Comment[] } {
    const thread = this.threadRepository.findById(id);
    if (!thread) {
      throw new NotFoundException(`Thread with ID ${id} NOT found.`);
    }
    return { ...thread, comments: this.commentsService.findByThread(id) };
  }

  create(payload: ThreadPayload): Thread {
    const thread: Thread = this.threadRepository.create(payload);
    return thread;
  }

  addComment(threadId: string, payload: CommentPayload): Comment {
    this.findById(threadId)
    return this.commentsService.create(threadId, payload)
  }

  getAuthorStats(): AuthorStat[] {
    const counts = new Map<string, number>();

    for (const thread of this.threadRepository.findAll()) {
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
