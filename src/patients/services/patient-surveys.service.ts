import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientSurveyAnswersValidatorService } from 'src/patient-survey-answers-validator/patient-survey-answers-validator.service';
import { SurveyAnswersRepository, SurveysRepository } from 'src/surveys/repositories';
import { SurveyStatus } from 'src/surveys/surveys.types';

import { PatientCompleteSurveyInput } from '../inputs';

@Injectable()
export class PatientSurveysService {
  constructor(
    private readonly surveysRepository: SurveysRepository,
    private readonly surveyAnswersRepository: SurveyAnswersRepository,
    private readonly patientSurveyAnswersValidatorService: PatientSurveyAnswersValidatorService,
  ) {}

  async findActiveSurvey(patientId: string) {
    const qb = this.surveysRepository
      .createQueryBuilder('surveys')
      .where('surveys."patientId" = :patientId')
      .andWhere('surveys.status = :status')
      .setParameters({
        patientId,
        status: SurveyStatus.ACTIVE,
      });

    return qb.getOne();
  }

  async completeSurvey(input: PatientCompleteSurveyInput) {
    const { surveyId, answers } = input;

    const survey = this.surveysRepository.findOne(surveyId);
    if (!survey) {
      throw new NotFoundException('Survey with such id not found');
    }

    const surveyAnswers = answers.map((answer) => {
      return this.surveyAnswersRepository.create({
        surveyId,
        questionId: answer.questionId,
        answerValue: answer.answerValue,
        answerQuestionOptionId: answer.answerQuestionOptionId,
        answerQuestionOptionsIds: answer.answerQuestionOptionsIds,
      });
    });

    const surveyAnswersIds = await this.surveyAnswersRepository
      .save(surveyAnswers)
      .then((entities) => entities.map((entity) => entity.id));

    this.surveysRepository.update(surveyId, { status: SurveyStatus.COMPLETED });

    this.patientSurveyAnswersValidatorService.validateSurveyAnswersOnCriticalValues(surveyId, surveyAnswersIds);
  }
}
