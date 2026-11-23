import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThreadsModule } from './threads/threads.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    // database: process.env.DB_PATH ?? 'data/cyber-chat.sqlite',
    database: 'data/cyber-chat.sqlite',
    autoLoadEntities: true,
    // synchronize: process.env.NODE_ENV !== 'production',
    synchronize: true
  }), ThreadsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
