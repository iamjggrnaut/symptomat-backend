import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { DoctorCreatedSurveysEvent } from 'src/common/events';
import { DOCTOR_CREATED_SURVEYS_EVENT } from 'src/common/events/events.types';
import { HospitalsPatientsRepository } from 'src/hospitals/repositories/';
import { SurveysRepository } from 'src/surveys/repositories';
import { cursorToData, dataToCursor } from 'src/utils/base64';
import { In } from 'typeorm';

import { PatientNotification } from '../entities/patient-notification.entity';
import { PatientNotificationModel } from '../models/patient-notification.model';
import { PatientNotificationKind } from '../patients.types';
import { PatientNotificationsRepository, PatientsRepository } from '../repositories';
import { NotificationHttpClient } from 'src/telegram/notification.http.client';
import { DoctorRepository } from 'src/doctors/repositories';

export interface PatientNotificationCursor {
  lastNotification: Pick<PatientNotification, 'createdAt' | 'id'>;
  take: number;
}
@Injectable()
export class PatientNotificationsService {
  constructor(
    private readonly surveysRepository: SurveysRepository,
    private readonly patientNotificationsRepository: PatientNotificationsRepository,
    readonly configService: ConfigService,
    readonly hospitalPatientRepository: HospitalsPatientsRepository,
    readonly patientRepository: PatientsRepository,
    readonly doctorRepository: DoctorRepository,
    // private readonly emailNotificationService: EmailNotificationsService,
    // private readonly patientPushNotificationsService: PatientPushNotificationsService,
    private readonly notificationClient: NotificationHttpClient,
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
      const patient: any = this.hospitalPatientRepository.findOneActualHospitalPatient({
        where: { patientId: survey.patientId },
      });
      const patientFromRepo:any = this.patientRepository.findOne({where: {id: survey.patientId}})
      const doctor: any = this.doctorRepository.findOne({where: {id: survey.doctorId}})
      if (survey.patient.notificationsSettings.newSurvey && patient) {

        this.notificationClient
        .send({
          type: 'newsurvey',
          payload: {
            patientId: patient.patientId,
            email: patientFromRepo.email,
            medicalCardNumber: patient.medicalCardNumber,
            firstName: patient.firstName,
            lastName: patient.lastName,
          },
          tgChatId: doctor.tgChatId,
        })
        .catch((e) => {});

        
        // this.patientPushNotificationsService.sendNewSurvey(survey);
        // this.emailNotificationService.notifyPatientNewQuery(
        //   email,
        //   firstName,
        //   lastName,
        //   googlePlayLink,
        //   appStoreLink,
        //   applicationName,
        // );
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
