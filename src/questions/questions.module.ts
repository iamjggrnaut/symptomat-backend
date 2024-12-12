import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionCategoryQuestionsRepository, QuestionOptionsRepository, QuestionsRepository } from './repositories';
import { QuestionResolver } from './resolvers';
import { QuestionMutationResolver } from './resolvers/question.mutation.resolver';
import { QuestionsService } from './services/questions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionsRepository, QuestionCategoryQuestionsRepository, QuestionOptionsRepository]),
  ],
  providers: [QuestionResolver, QuestionsService, QuestionMutationResolver],
})
export class QuestionsModule {}
