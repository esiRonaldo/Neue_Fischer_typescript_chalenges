import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModerationNoteToThreads1795545033231 implements MigrationInterface {
  name = 'AddModerationNoteToThreads1795545033231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_threads" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "author" varchar NOT NULL, "body" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "moderationNote" text)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_threads"("id", "title", "author", "body", "createdAt") SELECT "id", "title", "author", "body", "createdAt" FROM "threads"`,
    );
    await queryRunner.query(`DROP TABLE "threads"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_threads" RENAME TO "threads"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "threads" RENAME TO "temporary_threads"`,
    );
    await queryRunner.query(
      `CREATE TABLE "threads" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "author" varchar NOT NULL, "body" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "threads"("id", "title", "author", "body", "createdAt") SELECT "id", "title", "author", "body", "createdAt" FROM "temporary_threads"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_threads"`);
  }
}
