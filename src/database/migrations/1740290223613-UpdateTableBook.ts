import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableBook1740290223613 implements MigrationInterface {
  name = 'UpdateTableBook1740290223613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "FK_d2211ba79c9312cdcda4d7d5860"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "REL_d2211ba79c9312cdcda4d7d586"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "FK_d2211ba79c9312cdcda4d7d5860" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "FK_d2211ba79c9312cdcda4d7d5860"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "REL_d2211ba79c9312cdcda4d7d586" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "FK_d2211ba79c9312cdcda4d7d5860" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
