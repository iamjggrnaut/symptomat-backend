import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import _ from 'lodash';
import { DrugsQuestionsRepository } from 'src/drugs/repositories';
import { Question } from 'src/questions/entities';
import { QuestionType } from 'src/questions/questions.types';
import { QuestionOptionsRepository, QuestionsRepository } from 'src/questions/repositories';
import { In } from 'typeorm';

import { DoctorCreateSurveyTemplateInput, QuestionInput } from '../inputs';

@Injectable()
export class CreateSurveyTemplatePipe implements PipeTransform {
  constructor(
    private readonly drugsQuestionsRepository: DrugsQuestionsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionOptionsRepository: QuestionOptionsRepository,
  ) {}
  async transform(value: DoctorCreateSurveyTemplateInput) {
    await this.validateAllDrugsQuestionsDefined(value);

    const inputQuestionsIds = value.questions.map((iq) => iq.questionId);
    const questions = await this.questionsRepository.find({
      where: {
        id: In(inputQuestionsIds),
      },
    });

    this.validateQuestionsCount(inputQuestionsIds, questions);
    this.validateQuestionTypes(value, questions);

    const inputCheckboxQuestions = value.questions.filter(
      (question) => question.questionType === QuestionType.CHECKBOX,
    );
    this.validateCheckboxQuestions(inputCheckboxQuestions);

    const inputRadioQuestions = value.questions.filter((question) => question.questionType === QuestionType.RADIO);
    this.validateRadioQuestions(inputRadioQuestions);

    const inputRestQuestions = value.questions.filter(
      (question) => question.questionType !== QuestionType.RADIO && question.questionType !== QuestionType.CHECKBOX,
    );
    this.validateRestQuestions(inputRestQuestions);

    await this.validateCrits(value);

    this.validateNumericMinMax(value, questions);
    this.validateScaleMinMax(value, questions);

    return value;
  }

  async validateAllDrugsQuestionsDefined(input: DoctorCreateSurveyTemplateInput) {
    const drugsQuestions = await this.drugsQuestionsRepository.find({
      where: {
        drugId: In(input.drugsIds),
      },
    });
    const questions = await this.questionsRepository.findByIds(
      drugsQuestions.map((dq) => dq.questionId),
      { where: { isActual: true }, select: ['id'] },
    );
    const drugsQuestionsIds = questions.map((q) => q.id);
    const questionsWithDrugs = input.questions.filter((iq) => drugsQuestionsIds.includes(iq.questionId));
    if (questionsWithDrugs.length < drugsQuestionsIds.length) {
      throw new BadRequestException('All drugs questions required');
    }
  }

  validateQuestionsCount(inputQuestionsIds: string[], questions: Question[]) {
    if (inputQuestionsIds.length !== questions.length) {
      throw new BadRequestException('Invalid questions');
    }
  }

  validateQuestionTypes(input: DoctorCreateSurveyTemplateInput, questions: Question[]) {
    input.questions.forEach((iq) => {
      const { type } = questions.find((question) => question.id === iq.questionId);
      if (iq.questionType !== type) {
        throw new BadRequestException(`questionType must be ${type}!`);
      }
    });
  }

  validateCheckboxQuestions(inputCheckboxQuestions: QuestionInput[]) {
    inputCheckboxQuestions.forEach((iq) => {
      if (!_.isEmpty(iq.criticalIndicators)) {
        throw new BadRequestException(`Question type ${iq.questionType} can't have criticalIndicators!`);
      }
      if (!_.isEmpty(iq.criticalAnswerId)) {
        throw new BadRequestException(`Question type ${iq.questionType} can't have criticalAnswerId!`);
      }
    });
  }

  validateRadioQuestions(inputRadioQuestions: QuestionInput[]) {
    inputRadioQuestions.forEach((iq) => {
      if (!_.isEmpty(iq.criticalIndicators)) {
        throw new BadRequestException(`Question type ${iq.questionType} can't have criticalIndicators!`);
      }
      if (!_.isEmpty(iq.criticalAnswersIds)) {
        throw new BadRequestException(`Question type ${iq.questionType} can't have criticalAnswersIds!`);
      }
    });
  }

  validateRestQuestions(inputRestQuestions: QuestionInput[]) {
    inputRestQuestions.forEach((iq) => {
      if (!_.isEmpty(iq.criticalAnswersIds)) {
        throw new BadRequestException(`Question type ${iq.questionType} can't have criticalAnswersIds!`);
      }
      if (!_.isEmpty(iq.criticalAnswerId)) {
        throw new BadRequestException(`Question type ${iq.questionType} can't have criticalAnswerId!`);
      }
    });
  }

  async validateCrits(input: DoctorCreateSurveyTemplateInput) {
    const inputQuestionsWithCritAnswersIds = input.questions
      .filter((iq) => iq.criticalAnswerId || iq.criticalAnswersIds)
      .map((iq) => iq.questionId);

    const questionOptionsCrits = await this.questionOptionsRepository.find({
      where: {
        questionId: In(inputQuestionsWithCritAnswersIds),
      },
    });

    input.questions.forEach((iq) => {
      if (iq.questionType !== QuestionType.RADIO && iq.questionType !== QuestionType.CHECKBOX) {
        if (!_.isEmpty(iq.criticalIndicators)) {
          const type = iq.questionType;
          if (!iq.criticalIndicators[type]) {
            throw new BadRequestException(`${type} value is important in CriticalIndicators!`);
          }
        }
      } else {
        if (!_.isEmpty(iq.criticalAnswerId)) {
          const foundAnswer = questionOptionsCrits.find(
            (questionOption) =>
              questionOption.id === iq.criticalAnswerId && questionOption.questionId === iq.questionId,
          );

          if (!foundAnswer) {
            throw new BadRequestException(
              `criticalAnswer ${iq.criticalAnswerId} doesn't belong to question ${iq.questionId}!`,
            );
          }
        }
        if (!_.isEmpty(iq.criticalAnswersIds)) {
          iq.criticalAnswersIds.forEach((criticalAnswerId) => {
            const foundAnswer = questionOptionsCrits.find(
              (questionOption) => questionOption.id === criticalAnswerId && questionOption.questionId === iq.questionId,
            );

            if (!foundAnswer) {
              throw new BadRequestException(
                `criticalAnswer ${criticalAnswerId} doesn't belong to question ${iq.questionId}!`,
              );
            }
          });
        }
      }
    });
  }

  validateNumericMinMax(input: DoctorCreateSurveyTemplateInput, questions: Question[]) {
    input.questions.forEach((iq) => {
      if (iq.questionType === QuestionType.NUMERIC) {
        if (!_.isEmpty(iq.criticalIndicators)) {
          const { indicators } = questions.find((question) => question.id === iq.questionId);
          const maxValue = indicators ? indicators?.numeric?.maxValue : Infinity;
          const minValue = indicators ? indicators?.numeric?.minValue : 0;
          if (iq.criticalIndicators.numeric.maxValue > maxValue) {
            throw new BadRequestException(`Numeric maxValue must be less than ${maxValue}!`);
          }
          if (iq.criticalIndicators.numeric.minValue < minValue) {
            throw new BadRequestException(`Numeric minValue must be more than ${minValue}!`);
          }
        }
      }
    });
  }

  validateScaleMinMax(input: DoctorCreateSurveyTemplateInput, questions: Question[]) {
    input.questions.forEach((iq) => {
      if (iq.questionType === QuestionType.SCALE) {
        if (!_.isEmpty(iq.criticalIndicators)) {
          const { indicators } = questions.find((question) => question.id === iq.questionId);
          const maxValue = indicators ? indicators?.scale.maxValue : Infinity;
          const minValue = indicators ? indicators?.scale.minValue : 0;
          if (iq.criticalIndicators.scale.value > maxValue) {
            throw new BadRequestException(`Scale value must be less than ${maxValue}!`);
          }
          if (iq.criticalIndicators.scale.value < minValue) {
            throw new BadRequestException(`Scale value must be more than ${minValue}!`);
          }
        }
      }
    });
  }
}
