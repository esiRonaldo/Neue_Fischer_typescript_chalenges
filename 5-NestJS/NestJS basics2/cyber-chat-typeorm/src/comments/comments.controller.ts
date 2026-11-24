import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { plainToInstance } from 'class-transformer';
import { CommentResponseDto } from './dto/comment-response.dto.js';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get()
    async findAll(): Promise<CommentResponseDto[]> {
        const comments = await this.commentsService.findAll()
        return plainToInstance(CommentResponseDto, comments, { excludeExtraneousValues: true })
    }

    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<CommentResponseDto> {
        const comment = await this.commentsService.findById(id)
        return plainToInstance(CommentResponseDto, comment, { excludeExtraneousValues: true })
    }

    @Delete(':id')
    async markDeleted(@Param('id', ParseUUIDPipe) id: string): Promise<CommentResponseDto> {
        const comment = await this.commentsService.markDeleted(id)
        return plainToInstance(CommentResponseDto, comment, { excludeExtraneousValues: true })
    }
}