import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionCategoriesRepository } from './question-categories.repository';
import {
  QuestionCategoriesMutationResolver,
  QuestionCategoriesQueryResolver,
  QuestionCategoryResolver,
} from './resolvers';
import { QuestionCategoriesService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionCategoriesRepository])],
  providers: [
    QuestionCategoriesService,
    QuestionCategoryResolver,
    QuestionCategoriesQueryResolver,
    QuestionCategoriesMutationResolver,
  ],
})
export class QuestionCategoriesModule {}
