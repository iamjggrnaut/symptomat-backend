import { EntityRepository, Repository } from 'typeorm';

import { QuestionCategoryQuestion } from '../entities';

@EntityRepository(QuestionCategoryQuestion)
export class QuestionCategoryQuestionsRepository extends Repository<QuestionCategoryQuestion> {}
