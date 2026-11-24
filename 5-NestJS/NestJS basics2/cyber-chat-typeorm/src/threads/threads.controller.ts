import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ThreadsService } from './threads.service.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { CreateCommentDto } from '../comments/dto/create-comment.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';
import { ThreadResponseDto } from './dto/thread-response.dto.js';
import { CommentResponseDto } from '../comments/dto/comment-response.dto.js';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) { }

  @Get()
  async findAll(@Query('author') author?: string): Promise<ThreadResponseDto[]> {
    const threads = await this.threadsService.findAll(author);
    return plainToInstance(ThreadResponseDto, threads, { excludeExtraneousValues: true });
  }

  @Get('authors')
  getAuthorStats() {
    return this.threadsService.getAuthorStats();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.findById(id);
    return plainToInstance(ThreadResponseDto, thread, { excludeExtraneousValues: true });
  }

  @Post()
  async create(@Body() payload: CreateThreadDto): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.create(payload);
    return plainToInstance(ThreadResponseDto, thread, { excludeExtraneousValues: true });
  }

  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() payload: CreateCommentDto): Promise<CommentResponseDto> {
    const comment = await this.threadsService.addComment(id, payload)
    return plainToInstance(CommentResponseDto, comment, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateThreadDto): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.update(id, dto)
    return plainToInstance(ThreadResponseDto, thread, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadsService.remove(id)
  }

}