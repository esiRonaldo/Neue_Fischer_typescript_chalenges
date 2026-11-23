import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import type { Comment } from './comment.entity.js';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get()
    findAll() {
        return this.commentsService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Comment> {
        return this.commentsService.findById(id)
    }

    @Delete(':id')
    markDeleted(@Param('id') id: string) {
        return this.commentsService.markDeleted(id)
    }
}