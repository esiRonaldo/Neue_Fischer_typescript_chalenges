export type Thread = {
  id: string;
  title: string;
  author: string;
  body: string;
  createdAt: Date;
};

export type ThreadPayload = Pick<Thread, 'title' | 'author' | 'body'>;

export type ThreadChanges = Partial<Pick<Thread, 'title' | 'body'>>