import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionOptionsRepository } from 'src/questions/repositories';
import { SurveyTemplatesQuestionsRepository } from 'src/survey-templates/repositories';
import { SurveyAnswersRepository, SurveysRepository } from 'src/surveys/repositories';

import { PatientSurveyAnswersValidatorService } from './patient-survey-answers-validator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveysRepository,
      SurveyAnswersRepository,
      SurveyTemplatesQuestionsRepository,
      QuestionOptionsRepository,
    ]),
  ],
  providers: [PatientSurveyAnswersValidatorService],
  exports: [PatientSurveyAnswersValidatorService],
})
export class PatientSurveyAnswersValidatorModule {}
