import { BadRequestException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DoctorCreatedSurveysEvent } from 'src/common/events';
import { DOCTOR_CREATED_SURVEYS_EVENT } from 'src/common/events/events.types';
import { EmailNotificationsService } from 'src/notifications/services';
import { SurveysRepository } from 'src/surveys/repositories';
import { cursorToData, dataToCursor } from 'src/utils/base64';
import { In } from 'typeorm';

import { PatientNotification } from '../entities/patient-notification.entity';
import { PatientNotificationModel } from '../models/patient-notification.model';
import { PatientNotificationKind } from '../patients.types';
import { PatientNotificationsRepository } from '../repositories';
import { PatientPushNotificationsService } from './patient-push-notifications.service';

export interface PatientNotificationCursor {
  lastNotification: Pick<PatientNotification, 'createdAt' | 'id'>;
  take: number;
}
@Injectable()
export class PatientNotificationsService {
  constructor(
    private readonly surveysRepository: SurveysRepository,
    private readonly patientNotificationsRepository: PatientNotificationsRepository,
    private readonly emailNotificationService: EmailNotificationsService,
    private readonly patientPushNotificationsService: PatientPushNotificationsService,
  ) {}
  async getNotifications({ patientId, first = 4, after }: { patientId: string; first?: number; after?: string }) {
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }

    const cursor: PatientNotificationCursor | null =
      after != null ? cursorToData<PatientNotificationCursor>(after) : null;
    const currentTake = cursor ? cursor.take : first + 1;
    const patientNotificationsQb = this.patientNotificationsRepository
      .createQueryBuilder('pn')
      .where(`pn.patientId = :patientId`, { patientId });

    if (cursor) {
      patientNotificationsQb.andWhere(
        `
            pn.createdAt < :lastNotificationCreatedAt OR
            (pn.createdAt = :lastNotificationCreatedAt AND pn.id < :lastNotificationId)`,
        {
          lastNotificationCreatedAt: cursor.lastNotification.createdAt,
          lastNotificationId: cursor.lastNotification.id,
        },
      );
    }

    const patientNotifications = await patientNotificationsQb
      .orderBy('pn.createdAt', 'DESC')
      .limit(currentTake)
      .getMany();
    let newCursor: PatientNotificationCursor;
    if (patientNotifications.length > 2) {
      newCursor = {
        take: currentTake,
        lastNotification: {
          createdAt: patientNotifications[patientNotifications.length - 2].createdAt,
          id: patientNotifications[patientNotifications.length - 2].id,
        },
      };
    }

    const hasNextPage = patientNotifications.length > currentTake - 1;
    const nodes = hasNextPage ? patientNotifications.slice(0, -1) : patientNotifications;
    return {
      nodes: nodes.map((patientNotification) => PatientNotificationModel.create(patientNotification)),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<PatientNotificationCursor>(newCursor) : null,
      },
    };
  }

  @OnEvent(DOCTOR_CREATED_SURVEYS_EVENT)
  async handleDoctorCreatedSurveysEvent(event: DoctorCreatedSurveysEvent) {
    const { surveyIds } = event;
    const surveys = await this.surveysRepository.find({
      where: {
        id: In(surveyIds),
      },
      relations: ['template', 'patient'],
    });
    const patientNotifications = surveys.map((survey) => {
      return {
        extraData: { surveyId: survey.id },
        patientId: survey.patientId,
        doctorId: survey.doctorId,
        title: `Новый опрос "${survey.template.title}"`,
        description: '',
        kind: PatientNotificationKind.NEW_SURVEY,
      };
    });
    this.patientNotificationsRepository.save(patientNotifications);

    surveys.forEach((survey) => {
      if (survey.patient.notificationsSettings.newSurvey) {
        const email = survey.patient.email;
        this.patientPushNotificationsService.sendNewSurvey(survey);
        this.emailNotificationService.send(email, `Вам пришел новый опрос "${survey.template.title}"`, 'Новый опрос');
      }
    });
  }

  async getUnreadNotificationsCount(patientId: string) {
    const unreadNotificationsCount = await this.patientNotificationsRepository.count({
      where: {
        patientId,
        isRead: false,
      },
    });
    return unreadNotificationsCount;
  }

  async readAllNotifications(patientId: string) {
    const unreadNotificationsCount = await this.getUnreadNotificationsCount(patientId);
    if (unreadNotificationsCount === 0) {
      throw new BadRequestException(`You don't have unread notifications`);
    }
    await this.patientNotificationsRepository.update({ isRead: false }, { isRead: true });
    return true;
  }

  async removePatientNotification(patientId: string, patientNotificationId: string) {
    const notification = await this.patientNotificationsRepository.findOne({
      where: {
        patientId,
        id: patientNotificationId,
      },
    });
    if (!notification) {
      throw new BadRequestException('Notification not found');
    }
    await this.patientNotificationsRepository.remove(notification);
    return true;
  }
}
