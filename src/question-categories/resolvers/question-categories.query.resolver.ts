import { Query, Resolver } from '@nestjs/graphql';

import { QuestionCategoryModel } from '../models';
import { QuestionCategory } from '../question-category.entity';
import { QuestionCategoriesService } from '../services';

@Resolver()
export class QuestionCategoriesQueryResolver {
  constructor(private readonly questionCategoriesService: QuestionCategoriesService) {}

  @Query(() => [QuestionCategoryModel], {
    description: 'Return all categories',
  })
  async findAllQuestionCategories(): Promise<QuestionCategory[]> {
    return this.questionCategoriesService.findAll();
  }
}
