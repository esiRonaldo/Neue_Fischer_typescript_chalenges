import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, type CommentPayload } from './comment.entity.js';
@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
    ) { }

    async findById(id: string): Promise<Comment> {
        const comment = await this.commentsRepository.findOneBy({ id })
        if (!comment) throw new NotFoundException(`Comment with ID ${id} NOT Found.`)
        return comment
    }

    async create(threadId: string, payload: CommentPayload): Promise<Comment> {
        const comment = this.commentsRepository.create({
            threadId,
            author: payload.author,
            body: payload.body,
        })
        return this.commentsRepository.save(comment)
    }

    //TODO:here return type is not mandatory , should we add it , is there anything to make it strict
    async markDeleted(id: string): Promise<Comment> {
        const comment = await this.findById(id)
        comment.body = 'deleted'
        return this.commentsRepository.save(comment)
    }

    async countByThread(threadId: string): Promise<number> {
        return this.commentsRepository.countBy({ threadId })
    }
}