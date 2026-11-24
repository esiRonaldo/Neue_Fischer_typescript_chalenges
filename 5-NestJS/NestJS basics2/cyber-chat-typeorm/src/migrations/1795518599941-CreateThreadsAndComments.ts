import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateThreadsAndComments1795518599941 implements MigrationInterface {
    name = 'CreateThreadsAndComments1795518599941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "threads" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "author" varchar NOT NULL, "body" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "threadId" varchar NOT NULL, "author" varchar NOT NULL, "body" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_comments" ("id" varchar PRIMARY KEY NOT NULL, "threadId" varchar NOT NULL, "author" varchar NOT NULL, "body" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f682eb665c360168731f596b0e3" FOREIGN KEY ("threadId") REFERENCES "threads" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comments"("id", "threadId", "author", "body", "createdAt") SELECT "id", "threadId", "author", "body", "createdAt" FROM "comments"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`ALTER TABLE "temporary_comments" RENAME TO "comments"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" RENAME TO "temporary_comments"`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "threadId" varchar NOT NULL, "author" varchar NOT NULL, "body" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "comments"("id", "threadId", "author", "body", "createdAt") SELECT "id", "threadId", "author", "body", "createdAt" FROM "temporary_comments"`);
        await queryRunner.query(`DROP TABLE "temporary_comments"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "threads"`);
    }

}
