import { Controller, Get, Query } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  findAll(@Query('author') author?: string) {
    return this.threadsService.findAll(author);
  }

  @Get('authors')
  getAuthorStats() {
    return this.threadsService.getAuthorStats();
  }
}
