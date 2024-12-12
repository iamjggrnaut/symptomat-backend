import { postgresCyrillicRegex } from 'src/utils/regex';
import { EntityRepository, Repository } from 'typeorm';

import { QuestionCategory } from './question-category.entity';

@EntityRepository(QuestionCategory)
export class QuestionCategoriesRepository extends Repository<QuestionCategory> {
  search(options?: { startAtCyrillic?: boolean }): Promise<QuestionCategory[]> {
    const qb = this.createQueryBuilder(QuestionCategory.tableName).orderBy('name', 'ASC');

    if (options.startAtCyrillic != undefined) {
      qb.where(
        `${QuestionCategory.tableName}."name" ${
          options.startAtCyrillic ? '' : 'NOT'
        } SIMILAR TO '${postgresCyrillicRegex}'`,
      );
    }

    return qb.getMany();
  }
}
