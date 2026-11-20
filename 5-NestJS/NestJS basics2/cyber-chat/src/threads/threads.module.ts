import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { ThreadsController } from './threads.controller.js';
import { ThreadsRepository } from './threads.repository.js';

@Module({
  providers: [ThreadsService, ThreadsRepository],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
