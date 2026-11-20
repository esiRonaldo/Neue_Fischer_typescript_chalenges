import { Injectable } from '@nestjs/common';
import type { Thread } from './thread.js';

type AuthorStat = {
  author: string;
  threads: number;
};

const sampleThreads: Thread[] = [
  {
    id: '4f5362f7-ee63-495a-8903-8240d95f6625',
    title: 'Tabs or spaces, final answer?',
    author: 'pixelpirate',
    body: 'My team argues about this in every code review. What does your formatter do?',
    createdAt: new Date('2026-11-12T08:15:00Z'),
  },
  {
    id: '733f77d2-f899-4580-8d60-8bac152930c7',
    title: 'Why does my useEffect run twice?',
    author: 'neonbyte',
    body: 'In development, every effect in my React app runs twice. In production, it runs once.',
    createdAt: new Date('2026-11-13T19:42:00Z'),
  },
  {
    id: '43f04043-20cf-4e7a-a430-4cbdf13a5f36',
    title: 'Best keyboard for long coding sessions',
    author: 'nullpointer',
    body: 'My wrists hurt after a full day. Split keyboard, low profile, or something else?',
    createdAt: new Date('2026-11-14T10:05:00Z'),
  },
  {
    id: 'ec5074f4-aacf-4f5b-b96b-beb7763d6073',
    title: 'Is SQLite enough for a side project?',
    author: 'neonbyte',
    body: 'I expect maybe a hundred users. Do I really need a database server?',
    createdAt: new Date('2026-11-16T21:30:00Z'),
  },
  {
    id: '1ee0c21f-27cd-4eb3-9bb6-ab1975a77f56',
    title: 'Show your terminal setup',
    author: 'pixelpirate',
    body: "Prompt, font, color scheme: post a screenshot and tell us what you can't live without.",
    createdAt: new Date('2026-11-17T07:55:00Z'),
  },
];

function byMostThreadsThenName(a: AuthorStat, b: AuthorStat): number {
  return b.threads - a.threads || a.author.localeCompare(b.author);
}

function sortByMostThreads(stats: readonly AuthorStat[]): AuthorStat[] {
  return stats.toSorted(byMostThreadsThenName);
}

function sortNewestFirst(threads: readonly Thread[]): Thread[] {
  return threads.toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

@Injectable()
export class ThreadsService {
  private readonly threads: readonly Thread[] = sampleThreads;

  findAll(author?: string): Thread[] {
    const threads =
      author === undefined
        ? this.threads
        : this.threads.filter((thread) => thread.author === author);

    return sortNewestFirst(threads);
  }

  getAuthorStats(): AuthorStat[] {
    const counts = new Map<string, number>();

    for (const thread of this.threads) {
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
