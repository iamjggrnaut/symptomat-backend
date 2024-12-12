import {MigrationInterface, QueryRunner} from "typeorm";

export class ActualQuestions1663820658462 implements MigrationInterface {
    name = 'ActualQuestions1663820658462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "isActual" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`UPDATE "questions" SET "isActual" = true WHERE "id" IN (
            SELECT DISTINCT ON ("title") id FROM questions ORDER BY "title" ASC, "createdAt" DESC
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isActual"`);
    }

}
