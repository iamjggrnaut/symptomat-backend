import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SurveyAnswersRepository, SurveysRepository } from './repositories';
import { SurveyAnswerResolver, SurveyResolver, SurveysQueryResolver } from './resolvers';
import { SurveysService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([SurveysRepository, SurveyAnswersRepository])],
  providers: [SurveysService, SurveyResolver, SurveyAnswerResolver, SurveysQueryResolver],
})
export class SurveysModule {}
