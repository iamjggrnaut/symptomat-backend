import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { QuestionType } from 'src/questions/questions.types';
import { QuestionsRepository } from 'src/questions/repositories';
import { SurveyTemplatesQuestionsRepository } from 'src/survey-templates/repositories';
import { SurveysRepository } from 'src/surveys/repositories';
import { SurveyStatus } from 'src/surveys/surveys.types';
import { In } from 'typeorm';

import { Patient } from '../entities';
import { PatientCompleteSurveyInput } from '../inputs';

@Injectable()
export class PatientCompleteSurveyGuard implements CanActivate {
  constructor(
    private readonly surveysRepository: SurveysRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly surveyTemplatesQuestionsRepository: SurveyTemplatesQuestionsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const patient = request.user as Patient;

    const { surveyId, answers } = ctx.getArgs().input as PatientCompleteSurveyInput;
    const survey = await this.surveysRepository.findOne(surveyId);

    if (!survey) {
      throw new NotFoundException('Survey with such id not found');
    }

    if (patient.id !== survey.patientId) {
      throw new ForbiddenException('This survey does not belongs to this patient');
    }

    if (survey.status !== SurveyStatus.ACTIVE) {
      throw new BadRequestException(`Срок заполнения опроса истек. Заполните активный опрос`);
    }

    const surveyQuestions = await this.surveyTemplatesQuestionsRepository.find({
      where: {
        templateId: survey.templateId,
      },
    });

    if (surveyQuestions.length > answers.length) {
      throw new BadRequestException('Answers for all survey questions required!');
    }

    const surveyQuestionsIds = surveyQuestions.map((surveyQuestion) => surveyQuestion.questionId);
    const invalidAnswerQuestionId = answers.find((answer) => {
      return !surveyQuestionsIds.includes(answer.questionId);
    })?.answerQuestionOptionId;
    if (invalidAnswerQuestionId) {
      throw new BadRequestException(`This survey doesn't include question with id = ${invalidAnswerQuestionId}`);
    }

    const answersQuestionIds = answers.map((answer) => answer.questionId);
    const questions = await this.questionsRepository.find({
      where: {
        id: In(answersQuestionIds),
      },
    });

    answers.forEach((answer) => {
      const { type } = questions.find((question) => question.id === answer.questionId);
      if (answer.questionType !== type) {
        throw new BadRequestException(`questionType must be ${type}!`);
      }
    });

    const invalidAnswer = answers.find((answer) => {
      const type = answer.questionType;
      if (type === QuestionType.RADIO) {
        return !answer.answerQuestionOptionId;
      }
      if (type == QuestionType.CHECKBOX) {
        return !answer.answerQuestionOptionsIds;
      }
      return !answer.answerValue[type];
    });
    if (invalidAnswer) {
      throw new BadRequestException(`${invalidAnswer.questionType} value is important!`);
    }

    answers.forEach((answer) => {
      if (answer.questionType === QuestionType.SCALE) {
        const { indicators } = questions.find((question) => question.id === answer.questionId);
        if (answer.answerValue.scale.value > indicators?.scale?.maxValue) {
          throw new BadRequestException(`Scale value must be less than ${indicators.scale.maxValue}!`);
        }
        if (answer.answerValue.scale.value < indicators?.scale?.minValue) {
          throw new BadRequestException(`Scale value must be more than ${indicators.scale.minValue}!`);
        }
      }

      if (answer.questionType === QuestionType.NUMERIC) {
        const { indicators } = questions.find((question) => question.id === answer.questionId);
        if (answer.answerValue.numeric.value > indicators?.numeric?.maxValue) {
          throw new BadRequestException(`Numeric value must be less than ${indicators.numeric.maxValue}!`);
        }
        if (answer.answerValue.numeric.value < indicators?.numeric?.minValue) {
          throw new BadRequestException(`Numeric value must be more than ${indicators.numeric.maxValue}!`);
        }
      }
    });
    return true;
  }
}
