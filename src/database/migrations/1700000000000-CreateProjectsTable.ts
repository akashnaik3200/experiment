import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectsTable1700000000000 implements MigrationInterface {
  name = 'CreateProjectsTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TYPE "projects_status_enum" AS ENUM ('active', 'disabled')
    `);

    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "publicKey" character varying(255) NOT NULL,
        "secretKey" character varying(255) NOT NULL,
        "status" "projects_status_enum" NOT NULL DEFAULT 'active',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_projects_publicKey" UNIQUE ("publicKey"),
        CONSTRAINT "UQ_projects_secretKey" UNIQUE ("secretKey")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "projects_status_enum"`);
  }
}
