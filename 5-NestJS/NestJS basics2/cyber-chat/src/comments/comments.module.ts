import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CommentsController } from './comments.controller.js';
import { CommentsRepository } from './comments.repository.js';

@Module({
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
  exports: [CommentsService]
})
export class CommentsModule { }
