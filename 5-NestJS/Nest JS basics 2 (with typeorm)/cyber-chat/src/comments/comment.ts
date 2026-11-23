export type Comment = {
  id: string;
  threadId: string;
  author: string;
  body: string;
  createdAt: Date;
};

export type CommentPayload = Pick<Comment, 'author' | 'body'>;
