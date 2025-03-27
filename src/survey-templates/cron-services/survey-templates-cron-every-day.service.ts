import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as Sentry from '@sentry/node';
import moment from 'moment';
import { DoctorCreatedSurveysEvent } from 'src/common/events';
import { DOCTOR_CREATED_SURVEYS_EVENT } from 'src/common/events/events.types';
import { SurveyTemplate } from 'src/survey-templates/entities';
import { SurveyTemplatesRepository } from 'src/survey-templates/repositories';
import {
  SurveyTemplateKind,
  SurveyTemplatePeriod,
  SurveyTemplateStatus,
} from 'src/survey-templates/survey-templates.types';
import { SurveysRepository } from 'src/surveys/repositories';
import { SurveyStatus } from 'src/surveys/surveys.types';
import { timezoneOffsets } from 'src/utils';
import { In } from 'typeorm';

const periodDateDiffSqlMapping: Record<SurveyTemplatePeriod, string> = {
  [SurveyTemplatePeriod.EVERYDAY]: /*sql*/ `
    DATE_PART('day', NOW()::date::timestamp - survey_templates."lastSentAt"::date::timestamp) = 1
  `,
  [SurveyTemplatePeriod.EVERY_TWO_DAYS]: /*sql*/ `
    DATE_PART('day', NOW()::date::timestamp - survey_templates."lastSentAt"::date::timestamp) = 2
  `,
  [SurveyTemplatePeriod.ONCE_A_WEEK]: /*sql*/ `
    TRUNC(DATE_PART('day', NOW()::date::timestamp - survey_templates."lastSentAt"::date::timestamp) / 7) = 1
  `,
  [SurveyTemplatePeriod.ONCE_IN_TWO_WEEKS]: /*sql*/ `
    TRUNC(DATE_PART('day', NOW()::date::timestamp - survey_templates."lastSentAt"::date::timestamp) / 7) = 2
  `,
};

@Injectable()
export class SurveyTemplatesCronEveryDayService {
  constructor(
    private readonly surveysRepository: SurveysRepository,
    private readonly surveyTemplatesRepository: SurveyTemplatesRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async handleSurveyTemplates(
    surveyTemplatePeriod: SurveyTemplatePeriod,
    surveyTemplatesWithTimezoneIds: string[],
  ) {
    if (surveyTemplatesWithTimezoneIds.length === 0) {
      return;
    }
    const sentryScope = new Sentry.Scope();

    const removeOldSurveyQb = this.surveyTemplatesRepository
      .createQueryBuilder('survey_templates')
      .select(['survey_templates.id AS id'])
      .where(`survey_templates."endAt"::date < NOW()::date`);

    sentryScope.setExtra('SQL QUERY', removeOldSurveyQb.getQuery());

    const removedSurveyTemplates = await removeOldSurveyQb.getRawMany<Pick<SurveyTemplate, 'id'>>();
    const removedSurveyTemplatesIds = removedSurveyTemplates.map((surveyTemplate) => surveyTemplate.id);

    sentryScope.setExtra('removedSurveyTemplates', removedSurveyTemplatesIds);
    if (removedSurveyTemplatesIds.length !== 0) {
      try {
        this.surveyTemplatesRepository.update(
          { id: In(removedSurveyTemplatesIds) },
          { status: SurveyTemplateStatus.CANCELED },
        );
        this.surveysRepository.update(
          {
            templateId: In(removedSurveyTemplatesIds),
          },
          { status: SurveyStatus.CANCELED },
        );
      } catch (error) {
        Sentry.captureException(error, sentryScope);
        Logger.error(error.message, error.stack, [this.constructor.name, this.handleSurveyTemplates].join(' | '));
      }
    }

    const createSurveyQb = this.surveyTemplatesRepository
      .createQueryBuilder('survey_templates')
      .select([
        'survey_templates.id AS id',
        'survey_templates."patientId" AS "patientId"',
        'survey_templates."doctorId" AS "doctorId"',
      ])
      .where(
        /*sql*/ `
        (
          survey_templates.status = :status
          AND survey_templates.period = :period
          AND survey_templates.kind = :kind
          AND survey_templates.id IN (:...surveyTemplatesWithTimezoneIds)
        )
      `,
        {
          kind: SurveyTemplateKind.PRIVATE,
          status: SurveyTemplateStatus.ACTIVE,
          period: surveyTemplatePeriod,
          surveyTemplatesWithTimezoneIds,
        },
      ).andWhere(`
        (
          survey_templates."startAt"::date + interval '1 day' <= NOW()::date
          AND survey_templates."endAt"::date + interval '1 day' >= NOW()::date
        )
      `).andWhere(/*sql*/ `
        (
          ${periodDateDiffSqlMapping[surveyTemplatePeriod]}
          OR survey_templates."lastSentAt" IS NULL
        )
      `);

    sentryScope.setExtra('SQL QUERY', createSurveyQb.getQuery());

    const surveyTemplates = await createSurveyQb.getRawMany<Pick<SurveyTemplate, 'id' | 'patientId' | 'doctorId'>>();
    const surveyTemplatesIds = surveyTemplates.map((surveyTemplate) => surveyTemplate.id);

    sentryScope.setExtra('surveyTemplates', surveyTemplates);
    if (surveyTemplatesIds.length !== 0) {
      try {
        // set new lastSentAt for every day templates
        this.surveyTemplatesRepository.update({ id: In(surveyTemplatesIds) }, { lastSentAt: new Date() });
        // cancel active surveys
        this.surveysRepository.update(
          {
            templateId: In(surveyTemplatesIds),
            status: SurveyStatus.ACTIVE,
          },
          { status: SurveyStatus.CANCELED },
        );
        // create new surveys
        const newSurveys = surveyTemplates.map((surveyTemplate) => {
          return this.surveysRepository.create({
            doctorId: surveyTemplate.doctorId,
            patientId: surveyTemplate.patientId,
            templateId: surveyTemplate.id,
            status: SurveyStatus.ACTIVE,
          });
        });
        const newSurveysIds = await this.surveysRepository
          .save(newSurveys)
          .then((createdSurveys) => createdSurveys.map(({ id }) => id));

        this.eventEmitter.emit(
          DOCTOR_CREATED_SURVEYS_EVENT,
          new DoctorCreatedSurveysEvent({ surveyIds: newSurveysIds }),
        );
      } catch (error) {
        Sentry.captureException(error, sentryScope);
        Logger.error(error.message, error.stack, [this.constructor.name, this.handleSurveyTemplates].join(' | '));
      }
    }
  }

  async getSurveyTemplatesIdsWhere9AM() {
    const timezoneOffset = timezoneOffsets.find((timezoneOffset) => {
      const timezoneUtcOffset = (timezoneOffset / 60) * -1;
      if (moment().utcOffset(timezoneUtcOffset).hours() === 9) {
        return timezoneOffset;
      }
    });
    const surveyTemplates = await this.surveyTemplatesRepository.find({
      where: {
        timezoneOffset,
      },
    });

    return surveyTemplates.map((surveyTemplate) => surveyTemplate.id);
  }

  // @Cron(CronExpression.EVERY_30_MINUTES, {
  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'EVERY_DAY_SURVEY_TEMPLATES_CRON',
  })
  async handleEveryDaySurveyTemplates() {
    this.handleSurveyTemplates(SurveyTemplatePeriod.EVERYDAY, await this.getSurveyTemplatesIdsWhere9AM());
  }

  // @Cron(CronExpression.EVERY_30_MINUTES, {
  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'EVERY_TWO_DAYS_SURVEY_TEMPLATES_CRON',
  })
  async handleEveryTwoDaysSurveyTemplates() {
    this.handleSurveyTemplates(SurveyTemplatePeriod.EVERY_TWO_DAYS, await this.getSurveyTemplatesIdsWhere9AM());
  }

  // @Cron(CronExpression.EVERY_30_MINUTES, {
  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'ONCE_A_WEEK_SURVEY_TEMPLATES_CRON',
  })
  async handleOnceAWeekSurveyTemplates() {
    this.handleSurveyTemplates(SurveyTemplatePeriod.ONCE_A_WEEK, await this.getSurveyTemplatesIdsWhere9AM());
  }

  // @Cron(CronExpression.EVERY_30_MINUTES, {
  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'ONCE_IN_TWO_WEEKS_SURVEY_TEMPLATES_CRON',
  })
  async handleOnceInTwoWeeksSurveyTemplates() {
    this.handleSurveyTemplates(SurveyTemplatePeriod.ONCE_IN_TWO_WEEKS, await this.getSurveyTemplatesIdsWhere9AM());
  }

  // @Cron(CronExpression.EVERY_30_MINUTES, {
  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'CANCEL_PAST_SURVEY_TEMPLATES_CRON',
  })
  async cancelPastSurveyTemplates() {
    this.surveyTemplatesRepository
      .createQueryBuilder('survey_templates')
      .update()
      .set({
        status: SurveyTemplateStatus.CANCELED,
      })
      .where('survey_templates."endAt"::date < NOW()::date')
      .andWhere(`survey_templates.status = :activeStatus`, {
        activeStatus: SurveyTemplateStatus.ACTIVE,
      })
      .execute();
  }
}
