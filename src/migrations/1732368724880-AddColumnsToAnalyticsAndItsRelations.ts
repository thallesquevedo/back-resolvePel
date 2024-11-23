import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsToAnalyticsAndItsRelations1732368724880
  implements MigrationInterface
{
  name = 'AddColumnsToAnalyticsAndItsRelations1732368724880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP CONSTRAINT "FK_d2e333a0018b737e28ddf8e64f5"`,
    );
    await queryRunner.query(`ALTER TABLE "req_servico" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP COLUMN "comentariosId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comentario" ADD "rating" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "analytics" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "analytics" ADD "reqServicoId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "analytics" ALTER COLUMN "count" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD CONSTRAINT "FK_a150437ec0be6ce6aaad3f374e9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD CONSTRAINT "FK_90009950d67ca8886a2aa63f958" FOREIGN KEY ("reqServicoId") REFERENCES "req_servico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "analytics" DROP CONSTRAINT "FK_90009950d67ca8886a2aa63f958"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" DROP CONSTRAINT "FK_a150437ec0be6ce6aaad3f374e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" ALTER COLUMN "count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" DROP COLUMN "reqServicoId"`,
    );
    await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "comentario" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD "comentariosId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD "rating" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD CONSTRAINT "FK_d2e333a0018b737e28ddf8e64f5" FOREIGN KEY ("comentariosId") REFERENCES "comentario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
