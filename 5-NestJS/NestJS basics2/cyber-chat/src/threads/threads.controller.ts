import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import type { Thread, ThreadChanges, ThreadPayload } from './thread.js';
import type { CommentPayload } from '../comments/comment.js';

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
  create(@Body() payload: ThreadPayload) {
    return this.threadsService.create(payload);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() payload: CommentPayload) {
    return this.threadsService.addComment(id, payload)
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: ThreadChanges): Thread {
    return this.threadsService.update(id, payload)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadsService.remove(id)
  }

}
