import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Comment } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

// LEARN: TypeORM wraps every database error in a QueryFailedError.
// driverError is the original SQLite error, and its code says what went wrong.
function isForeignKeyError(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string }).code ===
      'SQLITE_CONSTRAINT_FOREIGNKEY'
  );
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}
  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({ order: { createdAt: 'ASC' } });
  }
  async findById(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (!comment)
      throw new NotFoundException(`Comment with ID ${id} NOT Found.`);
    return comment;
  }

  async create(threadId: string, payload: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create({
      threadId,
      author: payload.author,
      body: payload.body,
    });
    // LEARN: ThreadsService.addComment checks the thread first, but the thread
    // can be deleted between that check and this insert. SQLite then rejects
    // the insert (foreign key), and without this catch the client gets a 500.
    try {
      // LEARN: `return await`, not just `return`. Without await, save() fails
      // after the function has left the try block, and the catch never runs.
      return await this.commentsRepository.save(comment);
    } catch (error) {
      if (isForeignKeyError(error)) {
        throw new NotFoundException(`Thread with ID ${threadId} NOT found.`);
      }
      // LEARN: any other error is unexpected. Throw it again: Nest answers
      // with 500 and logs the stack trace for us.
      throw error;
    }
  }

  async markDeleted(id: string): Promise<Comment> {
    const comment = await this.findById(id);
    comment.body = 'deleted';
    return this.commentsRepository.save(comment);
  }

  async countByThread(threadId: string): Promise<number> {
    return this.commentsRepository.countBy({ threadId });
  }
}
