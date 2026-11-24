import { DataSource } from 'typeorm';
import { Comment } from './comments/comment.entity.js';
import { Thread } from './threads/thread.entity.js';

const database = process.env.DATABASE_PATH;
if (!database) {
  throw new Error('DATABASE_PATH is missing. Add it to .env');
}

export default new DataSource({
  type: 'better-sqlite3',
  database,
  entities: [Thread, Comment],
  migrations: ['dist/migrations/*.js'],
});
