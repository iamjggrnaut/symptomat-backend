import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { QuestionType } from 'src/questions/questions.types';
import { QuestionOptionsRepository, QuestionsRepository } from 'src/questions/repositories';
import { SurveyTemplateQuestion } from 'src/survey-templates/entities';
import { SurveyTemplatesQuestionsRepository, SurveyTemplatesRepository } from 'src/survey-templates/repositories';
import { SurveyTemplateStatus } from 'src/survey-templates/survey-templates.types';
import { SurveyAnswer } from 'src/surveys/entities';
import { SurveyAnswersRepository, SurveysRepository } from 'src/surveys/repositories';
import { SurveyStatus } from 'src/surveys/surveys.types';
import { cursorToData, dataToCursor } from 'src/utils/base64';

import { DoctorPatientSurveyAnswerModel } from '../models';

interface SurveyAnswersCursor {
  lastSurveyAnswer: Pick<SurveyAnswer, 'createdAt'>;
  take: number;
  startAt?: Date;
  endAt?: Date;
}

@Injectable()
export class DoctorSurveysService {
  constructor(
    private readonly surveysRepository: SurveysRepository,
    private readonly surveyAnswersRepository: SurveyAnswersRepository,
    private readonly surveyTemplatesRepository: SurveyTemplatesRepository,
    private readonly surveyTemplatesQuestionsRepository: SurveyTemplatesQuestionsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionOptionsRepository: QuestionOptionsRepository,
  ) {}

  async findDoctorPatientSurveyAnswers(
    doctorId: string,
    patientId: string,
    surveyTemplateId: string | null,
  ): Promise<DoctorPatientSurveyAnswerModel[]> {
    const surveyAnswers = await this.surveyAnswersRepository.findLastDoctorPatientAnswers(
      doctorId,
      patientId,
      surveyTemplateId,
    );

    const templatesIds = surveyTemplateId
      ? [surveyTemplateId]
      : await this.surveyTemplatesRepository.loadPatientSurveyTemplateIds(patientId, doctorId);
    if (!_.isEmpty(templatesIds)) {
      const templateQuestions = await this.surveyTemplatesQuestionsRepository.loadSurveyTemplatesQuestions(
        templatesIds,
      );
      const uniqQuestions = templateQuestions.reduce((acc, templateQuestion) => {
        const uniqQuestion = templateQuestion.filter(
          (question) => !acc.map((elem) => elem.questionId).includes(question.questionId),
        );
        return [...acc, ...uniqQuestion];
      });
      const notAnsweredQuestions: SurveyTemplateQuestion[] = uniqQuestions.filter(
        (question) => !surveyAnswers.map((answer) => answer.questionId).includes(question.questionId),
      );

      const notAnsweredSurveyAnswers: SurveyAnswer[] = await Promise.all(
        notAnsweredQuestions.map(async (questionTemplate) => {
          const surveyId = await this.surveysRepository.findOne({ where: { templateId: questionTemplate.templateId } });
          if (!surveyId) {
            return null;
          }
          const surveyAnswer = new SurveyAnswer();
          surveyAnswer.surveyId = surveyId.id;
          surveyAnswer.isCritical = false;
          surveyAnswer.questionId = questionTemplate.questionId;
          surveyAnswer.question = await this.questionsRepository.findOne({
            where: { id: questionTemplate.questionId },
          });
          return surveyAnswer;
        }),
      );
      notAnsweredSurveyAnswers.filter((answer) => answer !== null).forEach((answer) => surveyAnswers.push(answer));
    }

    const stats = await this.surveyAnswersRepository.findMinMaxDoctorPatientAnswersStats(
      doctorId,
      patientId,
      surveyTemplateId,
    );
    const questionOptionsByQuestionIdAndIndex = await this.questionOptionsRepository.findBySurveyAnswersStats(stats);
    const statsByQuestionId = _.keyBy(stats, (stat) => stat.questionId);

    const resultPromises = surveyAnswers.map<Promise<DoctorPatientSurveyAnswerModel>>(async (surveyAnswer) => {
      const { questionId, answerQuestionOption, question, isCritical } = surveyAnswer;
      const { type: questionType } = question;

      const stat = statsByQuestionId[questionId];

      const { answerQuestionOptionsIds } = surveyAnswer;
      const answerQuestionOptionsTexts =
        (answerQuestionOptionsIds?.length || 0) === 0
          ? null
          : await this.questionOptionsRepository
              .findByIds(surveyAnswer.answerQuestionOptionsIds)
              .then((answerQuestionOptions) => {
                return answerQuestionOptions.map((answerQuestionOption) => answerQuestionOption.text);
              });

      let minAnswerQuestionOption = null;
      let maxAnswerQuestionOption = null;
      if (stat) {
        const { answerQuestionOptionMinIndex, answerQuestionOptionMaxIndex } = stat;
        const questionOptionsByIndex = questionOptionsByQuestionIdAndIndex[questionId];
        minAnswerQuestionOption = questionOptionsByIndex && questionOptionsByIndex[answerQuestionOptionMinIndex];
        maxAnswerQuestionOption = questionOptionsByIndex && questionOptionsByIndex[answerQuestionOptionMaxIndex];
      }

      let minAnswer = null;
      let maxAnswer = null;

      if ([QuestionType.RADIO, QuestionType.CHECKBOX].includes(questionType)) {
        minAnswer = minAnswerQuestionOption?.text || null;
        maxAnswer = maxAnswerQuestionOption?.text || null;
      } else if (!stat) {
        minAnswer = null;
        maxAnswer = null;
      } else if (questionType === QuestionType.PRESSURE) {
        const {
          pressureUpperMax,
          pressureUpperMin,

          pressureLowerMax,
          pressureLowerMin,
        } = stat;
        minAnswer = `${pressureUpperMin} - ${pressureUpperMax}`;
        maxAnswer = `${pressureLowerMin} - ${pressureLowerMax}`;
      } else {
        minAnswer = stat[`${questionType}Min`] ?? null;
        maxAnswer = stat[`${questionType}Max`] ?? null;
      }

      return {
        id: surveyAnswer.id,
        questionId: surveyAnswer.questionId,
        questionTitle: surveyAnswer.question.title,
        questionType: surveyAnswer.question.type,
        isQuestionCustom: surveyAnswer.question.isCustom,
        answerValue: surveyAnswer.answerValue,
        answerQuestionOptionText: answerQuestionOption?.text || null,
        answerQuestionOptionsTexts: answerQuestionOptionsTexts,
        minAnswer,
        maxAnswer,
        isCritical,
      };
    });

    return Promise.all(resultPromises);
  }

  async findDoctorPatientQuestionAnswers({
    doctorId,
    patientId,
    questionId,
    take = 4,
    after,
    surveyTemplateId,
    startAt,
    endAt,
  }: {
    doctorId: string;
    patientId: string;
    questionId: string;
    take: number;
    after: string | null;
    surveyTemplateId: string | null;
    startAt: Date | null;
    endAt: Date | null;
  }) {
    if (take < 0) {
      throw new Error('Argument `take` must be non-negative number.');
    }
    if (take > 20) {
      throw new Error('Argument `take` must be less than or equal 20.');
    }

    const cursor: SurveyAnswersCursor | null = after != null ? cursorToData<SurveyAnswersCursor>(after) : null;
    const currentTake = cursor ? cursor.take : take + 1;
    const currentStartAt = cursor ? cursor.startAt : startAt;
    const currentEndAt = cursor ? cursor.endAt : endAt;

    const surveyAnswersIds = await this.surveyAnswersRepository
      .findDoctorPatientQuestionAnswers({
        doctorId,
        patientId,
        questionId,
        take: currentTake,
        surveyTemplateId,
        startAt: currentStartAt,
        endAt: currentEndAt,
        lastSurveyAnswer: cursor?.lastSurveyAnswer,
      })
      .getRawMany();

    let newCursor: SurveyAnswersCursor;
    if (surveyAnswersIds.length > 2) {
      newCursor = {
        take: currentTake,
        startAt: currentStartAt,
        endAt: currentEndAt,
        lastSurveyAnswer: {
          createdAt: surveyAnswersIds[surveyAnswersIds.length - 2].createdAt,
        },
      };
    }

    const hasNextPage = surveyAnswersIds.length > currentTake - 1;
    const finalSurveyAnswersIds = hasNextPage ? surveyAnswersIds.slice(0, -1) : surveyAnswersIds;
    const surveyAnswers = this.surveyAnswersRepository.findByIds(finalSurveyAnswersIds, {
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      nodes: surveyAnswers,
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<SurveyAnswersCursor>(newCursor) : null,
      },
    };
  }

  async cancelDoctorPatientActiveSurvey(doctorId: string, patientId: string) {
    const activeSurvey = await this.surveysRepository.findOne({
      where: { doctorId, patientId, status: SurveyStatus.ACTIVE },
    });
    const activeSurveyTemplate = await this.surveyTemplatesRepository.findOne({
      where: { doctorId, patientId, status: SurveyTemplateStatus.ACTIVE },
    });

    if (!activeSurvey && !activeSurveyTemplate) {
      throw new BadRequestException(`Patient doesn't have an active survey`);
    }

    await this.surveyTemplatesRepository.update(
      { doctorId, patientId, status: SurveyTemplateStatus.ACTIVE },
      { status: SurveyTemplateStatus.CANCELED },
    );
    await this.surveysRepository.update(
      { doctorId, patientId, status: SurveyStatus.ACTIVE },
      { status: SurveyStatus.CANCELED },
    );
  }
}
