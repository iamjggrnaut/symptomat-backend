import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveysRepository } from 'src/surveys/repositories';

import { cronProviders } from './cron-services/providers';
import {
  SurveyTemplatesDrugsRepository,
  SurveyTemplatesQuestionsRepository,
  SurveyTemplatesRepository,
} from './repositories';
import { SurveyTemplateResolver, SurveyTemplatesMutationResolver, SurveyTemplatesQueryResolver } from './resolvers';
import { SurveyTemplatesService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveysRepository,
      SurveyTemplatesRepository,
      SurveyTemplatesDrugsRepository,
      SurveyTemplatesQuestionsRepository,
    ]),
  ],
  providers: [
    ...cronProviders,
    SurveyTemplatesService,
    SurveyTemplateResolver,
    SurveyTemplatesQueryResolver,
    SurveyTemplatesMutationResolver,
  ],
})
export class SurveyTemplateModule {}
