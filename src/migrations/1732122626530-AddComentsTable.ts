import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComentsTable1732122626530 implements MigrationInterface {
  name = 'AddComentsTable1732122626530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comentario" ("id" SERIAL NOT NULL, "comentario" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reqServicoId" uuid, "userId" uuid, CONSTRAINT "PK_c9014211e5fbf491b9e3543bb19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD "rating" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD "comentariosId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "comentario" ADD CONSTRAINT "FK_71644db5a60b48fd2f79a8ca134" FOREIGN KEY ("reqServicoId") REFERENCES "req_servico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comentario" ADD CONSTRAINT "FK_27a52e0cd57d5571f00d229cfc3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" ADD CONSTRAINT "FK_d2e333a0018b737e28ddf8e64f5" FOREIGN KEY ("comentariosId") REFERENCES "comentario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP CONSTRAINT "FK_d2e333a0018b737e28ddf8e64f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comentario" DROP CONSTRAINT "FK_27a52e0cd57d5571f00d229cfc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comentario" DROP CONSTRAINT "FK_71644db5a60b48fd2f79a8ca134"`,
    );
    await queryRunner.query(
      `ALTER TABLE "req_servico" DROP COLUMN "comentariosId"`,
    );
    await queryRunner.query(`ALTER TABLE "req_servico" DROP COLUMN "rating"`);
    await queryRunner.query(`DROP TABLE "comentario"`);
  }
}
