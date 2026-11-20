import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { ThreadsController } from './threads.controller.js';

@Module({
  providers: [ThreadsService],
  controllers: [ThreadsController]
})
export class ThreadsModule {}
