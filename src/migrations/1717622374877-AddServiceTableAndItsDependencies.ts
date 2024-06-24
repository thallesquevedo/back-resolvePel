import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceTableAndItsDependencies1717622374877
  implements MigrationInterface
{
  name = 'AddServiceTableAndItsDependencies1717622374877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "items" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "servicos" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91c99670ea2115d2028a48c5e0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "req_servico" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "servicoId" integer, CONSTRAINT "REL_ca2d160a29473da5c86d693dde" UNIQUE ("servicoId"), CONSTRAINT "PK_d34bcc32b93d4b15bd2e86176e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "req_servico_items_items" ("reqServicoId" uuid NOT NULL, "itemsId" integer NOT NULL, CONSTRAINT "PK_902a31a1f97ae4c18d549b3bcd0" PRIMARY KEY ("reqServicoId", "itemsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f839abd87a7315c087bcd3996" ON "req_servico_items_items" ("reqServicoId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b751485a02ab8d9df2ed01f83" ON "req_servico_items_items" ("itemsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD CONSTRAINT "FK_ba20a9d21b039c07e31c9702bf1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD CONSTRAINT "FK_ca2d160a29473da5c86d693dde9" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico_items_items" ADD CONSTRAINT "FK_1f839abd87a7315c087bcd3996a" FOREIGN KEY ("reqServicoId") REFERENCES "req_servico"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico_items_items" ADD CONSTRAINT "FK_9b751485a02ab8d9df2ed01f830" FOREIGN KEY ("itemsId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "req_servico_items_items" DROP CONSTRAINT "FK_9b751485a02ab8d9df2ed01f830"`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico_items_items" DROP CONSTRAINT "FK_1f839abd87a7315c087bcd3996a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP CONSTRAINT "FK_ca2d160a29473da5c86d693dde9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP CONSTRAINT "FK_ba20a9d21b039c07e31c9702bf1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9b751485a02ab8d9df2ed01f83"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f839abd87a7315c087bcd3996"`,
    );
    await queryRunner.query(`DROP TABLE "req_servico_items_items"`);
    await queryRunner.query(`DROP TABLE "req_servico"`);
    await queryRunner.query(`DROP TABLE "servicos"`);
    await queryRunner.query(`DROP TABLE "items"`);
  }
}
