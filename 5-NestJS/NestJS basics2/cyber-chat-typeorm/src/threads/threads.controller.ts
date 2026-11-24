import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import type { Thread } from './thread.entity.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { CreateCommentDto } from '../comments/dto/create-comment.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) { }

  @Get()
  findAll(@Query('author') author?: string) {
    return this.threadsService.findAll(author);
  }

  @Get('authors')
  getAuthorStats() {
    return this.threadsService.getAuthorStats();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.threadsService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateThreadDto) {
    return this.threadsService.create(payload);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() payload: CreateCommentDto) {
    return this.threadsService.addComment(id, payload)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateThreadDto): Promise<Thread> {
    return this.threadsService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadsService.remove(id)
  }

}
