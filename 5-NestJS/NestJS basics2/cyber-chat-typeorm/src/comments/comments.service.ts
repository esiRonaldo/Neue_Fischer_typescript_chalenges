import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
    ) { }
    async findAll(): Promise<Comment[]> {
        return this.commentsRepository.find({ order: { createdAt: 'ASC' } })
    }
    async findById(id: string): Promise<Comment> {
        const comment = await this.commentsRepository.findOneBy({ id })
        if (!comment) throw new NotFoundException(`Comment with ID ${id} NOT Found.`)
        return comment
    }

    async create(threadId: string, payload: CreateCommentDto): Promise<Comment> {
        const comment = this.commentsRepository.create({
            threadId,
            author: payload.author,
            body: payload.body,
        })
        return this.commentsRepository.save(comment)
    }
    // when do we need ty/catch ,  and when do we need to check error handling in delete if comment not exist?
    async markDeleted(id: string): Promise<Comment> {
        const comment = await this.findById(id)
        comment.body = 'deleted'
        return this.commentsRepository.save(comment)
    }
    // async markDeleted(id: string): Promise<Comment> {
    //  if (id === undefined || id.trim() === '') {
    // throw new BadRequestException(`Comment ID cannot be empty`);
    //  }
    // const comment = await this.comments.findOneBy({ id });
    // if (!comment) {
    // throw new NotFoundException(`Comment with id ${id} not found`);
    //  }
    // comment.body = 'deleted';
    // return this.comments.save(comment);
    //  }
    async countByThread(threadId: string): Promise<number> {
        return this.commentsRepository.countBy({ threadId })
    }
}