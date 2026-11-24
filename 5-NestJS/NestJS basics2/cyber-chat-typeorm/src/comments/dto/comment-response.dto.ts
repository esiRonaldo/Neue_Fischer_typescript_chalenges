import { Expose, plainToInstance } from 'class-transformer';
import type { Comment } from '../comment.entity.js';

export class CommentResponseDto {
  @Expose()
  id: string;

  @Expose()
  threadId: string;

  @Expose()
  author: string;

  @Expose()
  body: string;

  @Expose()
  createdAt: Date;
}

export function toCommentResponse(comment: Comment): CommentResponseDto {
  return plainToInstance(CommentResponseDto, comment, {
    excludeExtraneousValues: true,
  });
}
