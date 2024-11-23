import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreateUpdateColumnsToAnalytics1732370890344
  implements MigrationInterface
{
  name = 'AddCreateUpdateColumnsToAnalytics1732370890344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "created_at"`);
  }
}
