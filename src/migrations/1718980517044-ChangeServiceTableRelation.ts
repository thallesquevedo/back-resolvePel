import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeServiceTableRelation1718980517044
  implements MigrationInterface
{
  name = 'ChangeServiceTableRelation1718980517044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP CONSTRAINT "FK_ca2d160a29473da5c86d693dde9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP CONSTRAINT "REL_ca2d160a29473da5c86d693dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD CONSTRAINT "FK_ca2d160a29473da5c86d693dde9" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP CONSTRAINT "FK_ca2d160a29473da5c86d693dde9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD CONSTRAINT "REL_ca2d160a29473da5c86d693dde" UNIQUE ("servicoId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD CONSTRAINT "FK_ca2d160a29473da5c86d693dde9" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
