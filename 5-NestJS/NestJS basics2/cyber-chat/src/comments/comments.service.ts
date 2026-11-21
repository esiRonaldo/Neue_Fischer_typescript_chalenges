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

    create(threadId: string, payload: CommentPayload): Comment {
        return this.commentsRepository.create(threadId, payload)
    }

    findByThread(threadId: string): Comment[] {
        return this.commentsRepository.findByThread(threadId)
    }

    deleteByThread(threadId: string): void {
        this.commentsRepository.deleteByThread(threadId)
    }
//here return type is not mandatory , should we add it , is there anything to make it strict
    markDeleted(id:string):Comment {
        const comment = this.findById(id)
        const deletedComment: Comment = { ...comment, body: 'deleted' }
        return this.commentsRepository.save(deletedComment)
    }
}
