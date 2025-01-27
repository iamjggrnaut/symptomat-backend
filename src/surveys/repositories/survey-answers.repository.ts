import { BadRequestException } from '@nestjs/common';
import { isNumber } from 'lodash';
import { PatientWeightHistoryItemModel } from 'src/patients/models';
import { QuestionOption } from 'src/questions/entities';
import { QuestionType } from 'src/questions/questions.types';
import { EntityRepository, Repository } from 'typeorm';

import { SurveyAnswer } from '../entities';
import { SurveyAnswerStat } from '../surveys.types';

@EntityRepository(SurveyAnswer)
export class SurveyAnswersRepository extends Repository<SurveyAnswer> {
  createQueryBuilderByPatientIdAndQuestionType(
    patientId: string,
    questionType: QuestionType,
    options?: {
      alias: string;
      surveyAlias: string;
      questionAlias: string;
      orderDirection: 'ASC' | 'DESC';
    },
  ) {
    const { alias = 'survey_answers', surveyAlias = 'survey', questionAlias = 'question', orderDirection = 'ASC' } =
      options || {};

    const qb = this.createQueryBuilder(alias)
      .leftJoin(`${alias}.question`, questionAlias)
      .leftJoin('survey_answers.survey', surveyAlias)
      .where(`${surveyAlias}."patientId" = :patientId`)
      .andWhere(`${questionAlias}.type = :questionType`)
      .orderBy('survey_answers."createdAt"', orderDirection)
      .setParameters({ patientId, questionType });

    return qb;
  }

  createQueryBuilderByPatientIdAndQuestionTypeWithPagination({
    patientId,
    questionType,
    startAt,
    endAt,
    take,
    last,
    options,
  }: {
    patientId: string;
    questionType: QuestionType;
    take: number;
    startAt?: Date;
    endAt?: Date;
    last?: Pick<PatientWeightHistoryItemModel, 'createdAt'>;
    options?: {
      alias: string;
      surveyAlias: string;
      questionAlias: string;
      orderDirection: 'ASC' | 'DESC';
    };
  }) {
    const { alias = 'survey_answers', surveyAlias = 'survey', questionAlias = 'question', orderDirection = 'ASC' } =
      options || {};

    const qb = this.createQueryBuilder(alias)
      .leftJoin(`${alias}.question`, questionAlias)
      .leftJoin('survey_answers.survey', surveyAlias)
      .where(`${surveyAlias}."patientId" = :patientId`)
      .andWhere(`${questionAlias}.type = :questionType`)
      .setParameters({ patientId, questionType });

    if (last) {
      qb.andWhere(`survey_answers."createdAt" ${orderDirection == 'ASC' ? '<' : '>'} :lastCreatedAt`, {
        lastCreatedAt: last.createdAt,
      });
    }

    if (startAt || endAt) {
      if (!endAt) {
        throw new BadRequestException('"endAt" required if "startAt" exists');
      }

      if (!startAt) {
        throw new BadRequestException('"startAt" required if "endAt" exists');
      }

      qb.andWhere(`(survey_answers."createdAt"::timestamp BETWEEN :startAt::timestamp AND :endAt::timestamp)`, {
        startAt,
        endAt,
      });
    }
    return qb.orderBy('survey_answers."createdAt"', orderDirection).limit(take);
  }

  async findLastDoctorPatientAnswers(doctorId: string, patientId: string, surveyTemplateId?: string | null) {
    const qb = this.createQueryBuilder(`survey_answers`)
      .select('survey_answers.id', 'id')
      .leftJoin('survey_answers.survey', 'survey')
      .leftJoin('survey_answers.question', 'question')
      .distinctOn([`question.id`])
      .where(/*sql*/ `(survey."doctorId" = :doctorId AND survey."patientId" = :patientId)`, {
        doctorId,
        patientId,
      })
      .orderBy(/*sql*/ `question.id, survey_answers."createdAt"`, 'ASC');

    if (surveyTemplateId) {
      qb.andWhere(`survey."templateId" = :templateId`, { templateId: surveyTemplateId });
    }

    const surveyAnswersIds = await qb
      .getRawMany()
      .then((surveyAnswers) => surveyAnswers.map((surveyAnswer) => surveyAnswer.id));

    return this.findByIds(surveyAnswersIds, {
      relations: ['question', 'answerQuestionOption'],
    });
  }

  async findMinMaxDoctorPatientAnswersStats(
    doctorId: string,
    patientId: string,
    surveyTemplateId?: string | null,
  ): Promise<SurveyAnswerStat[]> {
    const qb = this.createQueryBuilder('survey_answers')
      .select([
        /*sql*/ `MAX(CAST(survey_answers."answerValue"::json->'weight'->>'value' AS REAL)) AS "weightMax"`,
        /*sql*/ `MIN(CAST(survey_answers."answerValue"::json->'weight'->>'value' AS REAL)) AS "weightMin"`,

        /*sql*/ `MAX(CAST(survey_answers."answerValue"::json->'pulse'->>'value' AS REAL)) AS "pulseMax"`,
        /*sql*/ `MIN(CAST(survey_answers."answerValue"::json->'pulse'->>'value' AS REAL)) AS "pulseMin"`,

        /*sql*/ `MAX(CAST(survey_answers."answerValue"::json->'numeric'->>'value' AS REAL)) AS "numericMax"`,
        /*sql*/ `MIN(CAST(survey_answers."answerValue"::json->'numeric'->>'value' AS REAL)) AS "numericMin"`,

        /*sql*/ `MAX(CAST(survey_answers."answerValue"::json->'scale'->>'value' AS REAL)) AS "scaleMax"`,
        /*sql*/ `MIN(CAST(survey_answers."answerValue"::json->'scale'->>'value' AS REAL)) AS "scaleMin"`,

        /*sql*/ `MAX(CAST(survey_answers."answerValue"::json->'temperature'->>'value' AS REAL)) AS "temperatureMax"`,
        /*sql*/ `MIN(CAST(survey_answers."answerValue"::json->'temperature'->>'value' AS REAL)) AS "temperatureMin"`,

        /*sql*/ `MAX(CAST(survey_answers."answerValue"::json->'pressure'->>'upperValue' AS REAL)) AS "pressureUpperMax"`,
        /*sql*/ `MIN(CAST(survey_answers."answerValue"::json->'pressure'->>'upperValue' AS REAL)) AS "pressureUpperMin"`,

        /*sql*/ `MAX(CAST(survey_answers."answerValue"::json->'pressure'->>'lowerValue' AS REAL)) AS "pressureLowerMax"`,
        /*sql*/ `MIN(CAST(survey_answers."answerValue"::json->'pressure'->>'lowerValue' AS REAL)) AS "pressureLowerMin"`,

        /*sql*/ `MAX(CAST(radioAnswerQuestionOption.index AS INTEGER)) AS "radioAnswerQuestionOptionMaxIndex"`,
        /*sql*/ `MIN(CAST(radioAnswerQuestionOption.index AS INTEGER)) AS "radioAnswerQuestionOptionMinIndex"`,

        /*sql*/ `MAX(CAST(checkboxAnswerQuestionOption.index AS INTEGER)) AS "checkboxAnswerQuestionOptionMaxIndex"`,
        /*sql*/ `MIN(CAST(checkboxAnswerQuestionOption.index AS INTEGER)) AS "checkboxAnswerQuestionOptionMinIndex"`,

        /*sql*/ `question.id AS "questionId"`,
      ])
      .leftJoin('survey_answers.survey', 'survey')
      .leftJoin('survey_answers.question', 'question')
      .leftJoin('survey_answers.answerQuestionOption', 'radioAnswerQuestionOption')
      .leftJoin(
        QuestionOption.tableName,
        'checkboxAnswerQuestionOption',
        /*sql*/ `checkboxAnswerQuestionOption.id = ANY(survey_answers."answerQuestionOptionsIds")`,
      )
      .where(/*sql*/ `(survey."doctorId" = :doctorId AND survey."patientId" = :patientId)`, {
        doctorId,
        patientId,
      })
      .groupBy(`question.id`);

    if (surveyTemplateId) {
      qb.andWhere(/*sql*/ `survey."templateId" = :templateId`, { templateId: surveyTemplateId });
    }

    return qb.getRawMany().then((answersStats) => {
      return answersStats.map((answerStat) => {
        const toNumberOrNull = (value: number | string | null) => (value !== null ? Number(value) : null);

        const radioAnswerQuestionOptionMaxIndex = toNumberOrNull(answerStat.radioAnswerQuestionOptionMaxIndex);
        const radioAnswerQuestionOptionMinIndex = toNumberOrNull(answerStat.radioAnswerQuestionOptionMinIndex);

        const checkboxAnswerQuestionOptionMaxIndex = toNumberOrNull(answerStat.checkboxAnswerQuestionOptionMaxIndex);
        const checkboxAnswerQuestionOptionMinIndex = toNumberOrNull(answerStat.checkboxAnswerQuestionOptionMinIndex);

        const answerQuestionOptionMaxIndex = isNumber(radioAnswerQuestionOptionMaxIndex)
          ? radioAnswerQuestionOptionMaxIndex
          : checkboxAnswerQuestionOptionMaxIndex;

        const answerQuestionOptionMinIndex = isNumber(radioAnswerQuestionOptionMinIndex)
          ? radioAnswerQuestionOptionMinIndex
          : checkboxAnswerQuestionOptionMinIndex;

        return {
          questionId: answerStat.questionId as string,

          weightMax: toNumberOrNull(answerStat.weightMax),
          weightMin: toNumberOrNull(answerStat.weightMin),

          pulseMax: toNumberOrNull(answerStat.pulseMax),
          pulseMin: toNumberOrNull(answerStat.pulseMin),

          numericMax: toNumberOrNull(answerStat.numericMax),
          numericMin: toNumberOrNull(answerStat.numericMin),

          scaleMax: toNumberOrNull(answerStat.scaleMax),
          scaleMin: toNumberOrNull(answerStat.scaleMin),

          temperatureMax: toNumberOrNull(answerStat.temperatureMax),
          temperatureMin: toNumberOrNull(answerStat.temperatureMin),

          pressureUpperMax: toNumberOrNull(answerStat.pressureUpperMax),
          pressureUpperMin: toNumberOrNull(answerStat.pressureUpperMin),

          pressureLowerMax: toNumberOrNull(answerStat.pressureLowerMax),
          pressureLowerMin: toNumberOrNull(answerStat.pressureLowerMin),

          answerQuestionOptionMaxIndex,
          answerQuestionOptionMinIndex,
        };
      });
    });
  }

  findDoctorPatientQuestionAnswers({
    doctorId,
    patientId,
    questionId,
    take,
    surveyTemplateId,
    startAt,
    endAt,
    lastSurveyAnswer,
  }: {
    doctorId: string;
    patientId: string;
    questionId: string;
    take: number;
    surveyTemplateId: string | null;
    startAt: Date | null;
    endAt: Date | null;
    lastSurveyAnswer: Pick<SurveyAnswer, 'createdAt'> | null;
  }) {
    const surveyAnswersIdsQb = this.createQueryBuilder('survey_answers')
      .select('survey_answers.id AS id')
      .addSelect('survey_answers.createdAt AS "createdAt"')
      .leftJoin('survey_answers.survey', 'survey')
      .where(/*sql*/ `(survey."patientId" = :patientId AND survey."doctorId" = :doctorId)`, {
        patientId,
        doctorId,
      })
      .andWhere(/*sql*/ `survey_answers."questionId" = :questionId`, { questionId });

    if (lastSurveyAnswer) {
      surveyAnswersIdsQb.andWhere(`survey_answers."createdAt" < :lastCreatedAt`, {
        lastCreatedAt: lastSurveyAnswer.createdAt,
      });
    }

    if (surveyTemplateId) {
      surveyAnswersIdsQb.andWhere(/*sql*/ `survey."templateId" = :templateId`, {
        templateId: surveyTemplateId,
      });
    }

    if (startAt || endAt) {
      if (!endAt) {
        throw new BadRequestException('"endAt" required if "startAt" exists');
      }

      if (!startAt) {
        throw new BadRequestException('"startAt" required if "endAt" exists');
      }

      surveyAnswersIdsQb.andWhere(/*sql*/ `(survey_answers."createdAt"::date BETWEEN :startAt AND :endAt)`, {
        startAt,
        endAt,
      });
    }

    return surveyAnswersIdsQb.orderBy('survey_answers."createdAt"', 'ASC').limit(take);
  }
}
