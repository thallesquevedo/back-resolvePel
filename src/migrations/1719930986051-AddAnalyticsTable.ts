import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnalyticsTable1719930986051 implements MigrationInterface {
  name = 'AddAnalyticsTable1719930986051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "analytics" ("id" SERIAL NOT NULL, "count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_3c96dcbf1e4c57ea9e0c3144bff" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "analytics"`);
  }
}
