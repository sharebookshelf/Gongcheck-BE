import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1706083301742 implements MigrationInterface {
  name = 'Migrations1706083301742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`phoneNumber\` varchar(1) NULL COMMENT '번호'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phoneNumber\``);
  }
}
