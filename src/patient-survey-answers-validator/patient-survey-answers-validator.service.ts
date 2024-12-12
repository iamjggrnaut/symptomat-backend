import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isEmpty } from 'lodash';
import { PATIENT_CRITICAL_INDICATORS_FACED_EVENT } from 'src/common/events/events.types';
import { PatientCriticalIndicatorsFacedEvent } from 'src/common/events/patient-critical-indicators-faced.event';
import { QuestionType } from 'src/questions/questions.types';
import { QuestionOptionsRepository } from 'src/questions/repositories';
import { SurveyTemplateQuestion } from 'src/survey-templates/entities';
import { SurveyTemplatesQuestionsRepository } from 'src/survey-templates/repositories';
import {
  SurveyTemplateNumericQuestionCriticalIndicators,
  SurveyTemplatePulseQuestionCriticalIndicators,
  SurveyTemplateTemperatureQuestionCriticalIndicators,
  SurveyTemplateWeightQuestionCriticalIndicators,
} from 'src/survey-templates/survey-templates.question-critical-indicators.types';
import { SurveyAnswer } from 'src/surveys/entities';
import { SurveyAnswersRepository, SurveysRepository } from 'src/surveys/repositories';
import {
  SurveyNumericAnswerValue,
  SurveyPulseAnswerValue,
  SurveyTemperatureAnswerValue,
  SurveyWeightAnswerValue,
} from 'src/surveys/surveys.answer-value.types';
import { In } from 'typeorm';

type NumerableIndicators =
  | SurveyTemplateWeightQuestionCriticalIndicators
  | SurveyTemplatePulseQuestionCriticalIndicators
  | SurveyTemplateNumericQuestionCriticalIndicators
  | SurveyTemplateTemperatureQuestionCriticalIndicators;

type NumerableAnswer =
  | SurveyWeightAnswerValue
  | SurveyPulseAnswerValue
  | SurveyNumericAnswerValue
  | SurveyTemperatureAnswerValue;

type Validator = (surveyAnswer: SurveyAnswer, surveyTemplateQuestion: SurveyTemplateQuestion) => Promise<boolean>;

@Injectable()
export class PatientSurveyAnswersValidatorService {
  constructor(
    private readonly surveysRepository: SurveysRepository,
    private readonly surveyAnswersRepository: SurveyAnswersRepository,
    private readonly surveyTemplatesQuestionsRepository: SurveyTemplatesQuestionsRepository,
    private readonly questionOptionsRepository: QuestionOptionsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async validateSurveyAnswersOnCriticalValues(surveyId: string, surveyAnswersIds: string[]) {
    const survey = await this.surveysRepository.findOne(surveyId);
    const { templateId } = survey;

    const surveyAnswers = await this.surveyAnswersRepository.findByIds(surveyAnswersIds, {
      relations: ['question'],
    });

    const criticalSurveyAnswersIdsPromise = surveyAnswers.reduce(async (accPromise, surveyAnswer) => {
      const acc = await accPromise;

      const {
        question: { type: questionType },
        questionId,
      } = surveyAnswer;
      const surveyTemplateQuestion = await this.surveyTemplatesQuestionsRepository.findOne({
        where: { templateId, questionId },
      });
      const { criticalIndicators, criticalAnswer, criticalAnswerId, criticalAnswersIds } = surveyTemplateQuestion;
      const hasCriticalValue = [criticalIndicators, criticalAnswer, criticalAnswerId, criticalAnswersIds]
        .map((crit) => !isEmpty(crit))
        .some(Boolean);
      if (!hasCriticalValue) {
        return acc;
      }

      const validate = this.getValidator(questionType);

      const isSurveyAnswerCritical = await validate(surveyAnswer, surveyTemplateQuestion);
      if (!isSurveyAnswerCritical) {
        return acc;
      }

      return [...acc, surveyAnswer.id];
    }, Promise.resolve([] as string[]));

    const criticalSurveyAnswersIds = await criticalSurveyAnswersIdsPromise;
    if (criticalSurveyAnswersIds.length !== 0) {
      await this.surveyAnswersRepository.update({ id: In(criticalSurveyAnswersIds) }, { isCritical: true });
      this.eventEmitter.emit(
        PATIENT_CRITICAL_INDICATORS_FACED_EVENT,
        new PatientCriticalIndicatorsFacedEvent({
          patientId: survey.patientId,
          doctorId: survey.doctorId,
          criticalSurveyAnswersIds,
          surveyTemplateId: survey.templateId,
        }),
      );
    }
  }

  private getValidator(questionType: QuestionType) {
    type ValidatorsMappingItem = {
      check: (questionType: QuestionType) => boolean;
      validate: Validator;
    };

    const validatorsMapping: Array<ValidatorsMappingItem> = [
      {
        check: (questionType: QuestionType) => questionType === QuestionType.CHECKBOX,
        validate: this.validateCheckboxSurveyAnswer,
      },
      {
        check: (questionType: QuestionType) => questionType === QuestionType.RADIO,
        validate: this.validateRadioSurveyAnswer,
      },
      {
        check: (questionType: QuestionType) => questionType === QuestionType.PRESSURE,
        validate: this.validatePressureSurveyAnswer,
      },
      {
        check: (questionType: QuestionType) => questionType === QuestionType.SCALE,
        validate: this.validateScaleSurveyAnswer,
      },
      {
        check: (questionType: QuestionType) => {
          return [QuestionType.NUMERIC, QuestionType.PULSE, QuestionType.TEMPERATURE, QuestionType.WEIGHT].includes(
            questionType,
          );
        },
        validate: this.validateNumerableSurveyAnswer,
      },
    ];

    const { validate } = validatorsMapping.find((action) => action.check(questionType)) || {};
    if (!validate) {
      throw new Error(`Validator not found for "${questionType}" question type`);
    }

    return validate;
  }

  private validateCheckboxSurveyAnswer: Validator = async (surveyAnswer, surveyTemplateQuestion) => {
    const { answerQuestionOptionsIds } = surveyAnswer;
    const { criticalAnswersIds } = surveyTemplateQuestion;

    return answerQuestionOptionsIds.some((answerQuestionOptionId) =>
      criticalAnswersIds.includes(answerQuestionOptionId),
    );
  };

  private validateRadioSurveyAnswer: Validator = async (surveyAnswer, surveyTemplateQuestion) => {
    const { questionId, answerQuestionOptionId } = surveyAnswer;
    const { criticalAnswerId } = surveyTemplateQuestion;

    const questionOptions = await this.questionOptionsRepository.find({
      where: { questionId },
    });

    const answerQuestionOption = questionOptions.find((questionOption) => questionOption.id === answerQuestionOptionId);
    const criticalAnswer = questionOptions.find((questionOption) => questionOption.id === criticalAnswerId);

    return answerQuestionOption.index >= criticalAnswer.index;
  };

  private validatePressureSurveyAnswer: Validator = async (surveyAnswer, surveyTemplateQuestion) => {
    const { pressure: pressureCriticalIndicators } = surveyTemplateQuestion.criticalIndicators;
    const { pressure } = surveyAnswer.answerValue;

    return [
      pressure.upperValue <= pressureCriticalIndicators.minUpperValue,
      pressure.upperValue >= pressureCriticalIndicators.maxUpperValue,
      pressure.lowerValue <= pressureCriticalIndicators.minLowerValue,
      pressure.lowerValue <= pressureCriticalIndicators.minLowerValue,
    ].some(Boolean);
  };

  private validateScaleSurveyAnswer: Validator = async (surveyAnswer, surveyTemplateQuestion) => {
    const { scale: scaleCriticalIndicators } = surveyTemplateQuestion.criticalIndicators;
    const { scale } = surveyAnswer.answerValue;

    return scale.value >= scaleCriticalIndicators.value;
  };

  private validateNumerableSurveyAnswer: Validator = async (surveyAnswer, surveyTemplateQuestion) => {
    const { question } = surveyAnswer;

    const numerableIndicators: NumerableIndicators = surveyTemplateQuestion.criticalIndicators[question.type];
    const answer: NumerableAnswer = surveyAnswer.answerValue[question.type];

    return [
      answer.value >= (numerableIndicators.maxValue || Infinity),
      answer.value <= (numerableIndicators.minValue || 0),
    ].some(Boolean);
  };
}
