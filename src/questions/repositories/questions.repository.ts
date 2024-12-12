import { postgresCyrillicRegex } from 'src/utils/regex';
import { EntityRepository, Repository } from 'typeorm';

import { Question, QuestionCategoryQuestion } from '../entities';

@EntityRepository(Question)
export class QuestionsRepository extends Repository<Question> {
  async findByTitleAndCategoryId(
    title: string,
    doctorId: string,
    categoryId?: string,
    options?: { startAtCyrillic?: boolean },
  ) {
    const qb = this.createQueryBuilder(`${Question.tableName}`)
      .where(
        `${Question.tableName}."title" ILIKE :title
            AND (${Question.tableName}."doctorId" = :doctorId OR ${Question.tableName}."doctorId" IS NULL)
            AND ${Question.tableName}."isActual" = true
            `,
        {
          title: `%${title}%`,
          doctorId,
        },
      )
      .orderBy('title', 'ASC');

    if (categoryId) {
      qb.leftJoinAndSelect(
        `${QuestionCategoryQuestion.tableName}`,
        'questionCategoryQuestion',
        'questions.id = questionCategoryQuestion.questionId',
      ).andWhere(`questionCategoryQuestion.questionCategoryId = :categoryId`, { categoryId });
    }

    if (options.startAtCyrillic != undefined) {
      qb.andWhere(
        `${Question.tableName}."title" ${options.startAtCyrillic ? '' : 'NOT'} SIMILAR TO '${postgresCyrillicRegex}'`,
      );
    }

    return qb.getMany();
  }
}
