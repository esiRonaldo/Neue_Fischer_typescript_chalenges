import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { ThreadsController } from './threads.controller.js';
import { CommentsModule } from '../comments/comments.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './thread.entity.js';

@Module({
  providers: [ThreadsService],
  controllers: [ThreadsController],
  imports: [TypeOrmModule.forFeature([Thread]), CommentsModule],
})
export class ThreadsModule {}
