import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import {
  CommentResponseDto,
  toCommentResponse,
} from './dto/comment-response.dto.js';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findAll(): Promise<CommentResponseDto[]> {
    const comments = await this.commentsService.findAll();
    return comments.map(toCommentResponse);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentsService.findById(id);
    return toCommentResponse(comment);
  }

  @Delete(':id')
  async markDeleted(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentsService.markDeleted(id);
    return toCommentResponse(comment);
  }
}
