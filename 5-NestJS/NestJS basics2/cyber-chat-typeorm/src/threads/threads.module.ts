import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { ThreadsController } from './threads.controller.js';
import { ThreadsRepository } from './threads.repository.js';
import { CommentsModule } from '../comments/comments.module.js';

@Module({
  providers: [ThreadsService, ThreadsRepository],
  controllers: [ThreadsController],
  imports: [CommentsModule]
})
export class ThreadsModule { }
