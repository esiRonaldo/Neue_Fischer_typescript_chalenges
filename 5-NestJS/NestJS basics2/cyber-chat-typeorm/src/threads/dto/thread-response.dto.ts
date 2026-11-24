import { Expose, plainToInstance, Type } from 'class-transformer';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto.js';
import type { Thread } from '../thread.entity.js';

export class ThreadResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  author: string;

  @Expose()
  body: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => CommentResponseDto)
  comments?: CommentResponseDto[];

  @Expose()
  commentCount?: number;
}

export function toThreadResponse(thread: Thread): ThreadResponseDto {
  return plainToInstance(ThreadResponseDto, thread, {
    excludeExtraneousValues: true,
  });
}
