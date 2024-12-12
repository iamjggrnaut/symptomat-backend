import { MigrationInterface, QueryRunner } from 'typeorm';
import crypto from 'crypto';

const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;
const encryptedPassword = crypto.createHmac('sha256', password).digest('hex');

export class CreateAdmin1663578420248 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO admins ("role", "email", "password", "firstName", "lastName")
                  values ('admin', '${email}', '${encryptedPassword}', 'Super', 'Admin');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM admins WHERE "email" = '${email}'`);
  }
}
