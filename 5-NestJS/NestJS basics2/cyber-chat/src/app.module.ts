import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThreadsModule } from './threads/threads.module.js';

@Module({
  imports: [ThreadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
