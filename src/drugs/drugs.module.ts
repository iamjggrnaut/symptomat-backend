import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsRepository } from 'src/questions/repositories';

import { DrugsQuestionsRepository, DrugsRepository } from './repositories';
import { DrugResolver, DrugsQueryResolver } from './resolvers';
import { DrugsService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([DrugsRepository, DrugsQuestionsRepository, QuestionsRepository])],
  providers: [DrugsService, DrugResolver, DrugsQueryResolver],
})
export class DrugsModule {}
