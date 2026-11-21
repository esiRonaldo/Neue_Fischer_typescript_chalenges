import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository.js';
import type { Comment, CommentPayload } from './comment.js';
@Injectable()
export class CommentsService {
    constructor(private readonly commentsRepository: CommentsRepository) { }

    findById(id: string): Comment {
        const comment = this.commentsRepository.findById(id)
        if (!comment) throw new NotFoundException(`Comment with ID ${id} NOT Found.`)
        return comment
    }

    create(threadId: string, payload: CommentPayload):Comment {
        return this.commentsRepository.create(threadId, payload)
    }

    findByThread(threadId: string): Comment[] {
        return this.commentsRepository.findByThread(threadId)
    }
}
