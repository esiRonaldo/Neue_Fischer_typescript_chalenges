import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThreadsModule } from './threads/threads.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  //   imports: [
  //     TypeOrmModule.forRoot({
  //     type: 'better-sqlite3',
  //     database: 'data/cyber-chat.sqlite',
  //     autoLoadEntities: true,
  //     synchronize: true
  //   }), ThreadsModule, CommentsModule],
  //   controllers: [AppController],
  //   providers: [AppService],
  // })
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.getOrThrow<string>('DATABASE_PATH'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ThreadsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
