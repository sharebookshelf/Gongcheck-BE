import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1707284594324 implements MigrationInterface {
  name = 'Migrations1707284594324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`book\` ADD \`dfdfdf\` varchar(20) NULL COMMENT 'ISBN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`book\` DROP COLUMN \`dfdfdf\``);
  }
}
