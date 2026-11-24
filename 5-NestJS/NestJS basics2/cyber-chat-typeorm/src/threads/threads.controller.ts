import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { CreateCommentDto } from '../comments/dto/create-comment.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';
import {
  ThreadResponseDto,
  toThreadResponse,
} from './dto/thread-response.dto.js';
import {
  CommentResponseDto,
  toCommentResponse,
} from '../comments/dto/comment-response.dto.js';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  async findAll(
    @Query('author') author?: string,
  ): Promise<ThreadResponseDto[]> {
    const threads = await this.threadsService.findAll(author);
    return threads.map(toThreadResponse);
  }

  @Get('authors')
  getAuthorStats() {
    return this.threadsService.getAuthorStats();
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.findById(id);
    return toThreadResponse(thread);
  }

  @Post()
  async create(@Body() payload: CreateThreadDto): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.create(payload);
    return toThreadResponse(thread);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.threadsService.addComment(id, payload);
    return toCommentResponse(comment);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThreadDto,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.update(id, dto);
    return toThreadResponse(thread);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.threadsService.remove(id);
  }
}
