import { BadRequestException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';
import {
  PatientAnalyzesCreatedEvent,
  PatientCriticalIndicatorsFacedEvent,
  PatientDoctorContactRequestEvent,
} from 'src/common/events';
import {
  PATIENT_ANALYZES_CREATED_EVENT,
  PATIENT_CRITICAL_INDICATORS_FACED_EVENT,
  PATIENT_DOCTOR_CONTACT_REQUEST_EVENT,
} from 'src/common/events/events.types';
import { HospitalPatientModel } from 'src/hospitals/models';
import { HospitalsDoctorsRepository, HospitalsPatientsRepository } from 'src/hospitals/repositories';
import { PatientsRepository } from 'src/patients/repositories';
import { QuestionType } from 'src/questions/questions.types';
import { QuestionOptionsRepository } from 'src/questions/repositories';
import { SurveyAnswersRepository } from 'src/surveys/repositories';
import {
  SurveyNumericAnswerValue,
  SurveyPulseAnswerValue,
  SurveyScaleAnswerValue,
  SurveyTemperatureAnswerValue,
  SurveyWeightAnswerValue,
} from 'src/surveys/surveys.answer-value.types';
import { NotificationHttpClient } from 'src/telegram/notification.http.client';
import { cursorToData, dataToCursor } from 'src/utils/base64';
import { In } from 'typeorm';

import { DoctorNotificationKind } from '../doctors.types';
import { DoctorNotification } from '../entities';
import { DoctorNotificationModel } from '../models/doctor-notification.model';
import { DoctorNotificationRepository, DoctorRepository } from '../repositories';
import { DoctorEmailNotificationService } from './doctor-email-notification.service';

export interface DoctorNotificationCursor {
  lastNotification: Pick<DoctorNotification, 'createdAt' | 'id'>;
  take: number;
}
@Injectable()
export class DoctorNotificationsService {
  constructor(
    private readonly doctorNotificationsRepository: DoctorNotificationRepository,
    private readonly hospitalsDoctorsRepository: HospitalsDoctorsRepository,
    private readonly hospitalsPatientsRepository: HospitalsPatientsRepository,
    private readonly patientsRepository: PatientsRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly doctorEmailNotificationService: DoctorEmailNotificationService,
    private readonly surveyAnswersRepository: SurveyAnswersRepository,
    private readonly questionOptionsRepository: QuestionOptionsRepository,
    private readonly notificationClient: NotificationHttpClient,

    private readonly i18n: I18nService,
  ) {}

  @OnEvent(PATIENT_ANALYZES_CREATED_EVENT)
  async handlePatientAnalyzesCreatedEvent(event: PatientAnalyzesCreatedEvent) {
    const { doctorId, patientId } = event;
    const { hospitalId } = await this.hospitalsDoctorsRepository.findOne({
      where: {
        doctorId,
      },
    });
    const hospitalPatient = await this.hospitalsPatientsRepository.findOne({
      where: {
        patientId,
        hospitalId,
      },
    });
    const { medicalCardNumber: patientMedicalCardNumber } = hospitalPatient;

    const { email, language: lang, notificationsSettings } = await this.doctorRepository.findOne(doctorId);

    const title = await this.i18n.translate('doctor-notifications.patient-upload-analyzes.title', { lang });
    const description = await this.i18n.translate('doctor-notifications.patient-upload-analyzes.description', {
      lang,
      args: { patientMedicalCardNumber },
    });

    this.doctorNotificationsRepository.save({
      title,
      description,
      patientId,
      doctorId,
      kind: DoctorNotificationKind.UPLOAD_ANALYZES_BY_PATIENT,
    });

    if (notificationsSettings.uploadAnalyzesByPatients) {
      this.doctorEmailNotificationService.sendUploadAnalyzesByPatientEmail({
        lang,
        email,
        patientMedicalCardNumber,
        patientId,
      });
    }
  }

  async getNotifications({ doctorId, first = 4, after }: { doctorId: string; first?: number; after?: string }) {
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }

    const cursor: DoctorNotificationCursor | null =
      after != null ? cursorToData<DoctorNotificationCursor>(after) : null;
    const currentTake = cursor ? cursor.take : first + 1;
    const doctorNotificationsQb = this.doctorNotificationsRepository
      .createQueryBuilder('dn')
      .where(`dn.doctorId = :doctorId`, { doctorId });

    if (cursor) {
      doctorNotificationsQb.andWhere(
        `
        dn.createdAt < :lastNotificationCreatedAt OR
        (dn.createdAt = :lastNotificationCreatedAt AND dn.id < :lastNotificationId)`,
        {
          lastNotificationCreatedAt: cursor.lastNotification.createdAt,
          lastNotificationId: cursor.lastNotification.id,
        },
      );
    }

    const doctorNotifications = await doctorNotificationsQb
      .orderBy('dn.createdAt', 'DESC')
      .limit(currentTake)
      .getMany();
    let newCursor: DoctorNotificationCursor;
    if (doctorNotifications.length > 2) {
      newCursor = {
        take: currentTake,
        lastNotification: {
          createdAt: doctorNotifications[doctorNotifications.length - 2].createdAt,
          id: doctorNotifications[doctorNotifications.length - 2].id,
        },
      };
    }
    const patientIds = doctorNotifications.map((notification) => notification.patientId);
    const { hospitalId } = await this.hospitalsDoctorsRepository.findOne({
      where: {
        doctorId,
      },
    });
    const hospitalPatients = await this.hospitalsPatientsRepository.find({
      where: {
        patientId: In(patientIds),
        hospitalId,
      },
    });
    const result = doctorNotifications.map((notification) => {
      const hospitalPatient = HospitalPatientModel.create(
        hospitalPatients.find((hp) => hp.patientId === notification.patientId),
      );
      return { ...notification, hospitalPatient };
    });

    const hasNextPage = doctorNotifications.length > currentTake - 1;
    const nodes = hasNextPage ? result.slice(0, -1) : result;

    return {
      nodes: nodes.map((doctorNotification) => DoctorNotificationModel.create(doctorNotification)),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<DoctorNotificationCursor>(newCursor) : null,
      },
    };
  }

  @OnEvent(PATIENT_DOCTOR_CONTACT_REQUEST_EVENT)
  async handlePatientDoctorContactRequestEvent(event: PatientDoctorContactRequestEvent) {
    const { doctorId, patientId, message } = event;
    const { hospitalId } = await this.hospitalsDoctorsRepository.findOne({
      where: {
        doctorId,
      },
    });
    const hospitalPatient = await this.hospitalsPatientsRepository.findOne({
      where: {
        patientId,
        hospitalId,
      },
    });
    this.doctorNotificationsRepository.save({
      title: 'Связь с пациентом',
      description: `Пациент ${hospitalPatient.firstName} ${hospitalPatient.lastName} просит Вас связаться с ним по следующей причине:\n${message}\nНомер медицинской карты: #${hospitalPatient.medicalCardNumber}`,
      doctorId,
      patientId,
      kind: DoctorNotificationKind.CONTACT_ME_REQUEST,
    });

    const doctor = await this.doctorRepository.findOne(doctorId);

    // updates
    const patient = await this.patientsRepository.findOne({ where: { id: patientId } });

    if (doctor.notificationsSettings.contactMeRequest) {
      this.notificationClient
        .send({
          type: 'contactmerequest',
          payload: {
            patientId: patientId,
            email: patient.email,
            medicalCardNumber: hospitalPatient.medicalCardNumber,
            firstName: hospitalPatient.firstName,
            lastName: hospitalPatient.lastName,
          },
          tgChatId: doctor.tgChatId,
        })
        .catch((e) => {});
    }

    // if (doctor.notificationsSettings.contactMeRequest) {
    //   const { email } = doctor;
    //   this.doctorEmailNotificationService.sendContactPatientRequestEmail(
    //     email,
    //     hospitalPatient.medicalCardNumber,
    //     message,
    //     patientId,
    //   );
    // }
  }

  @OnEvent(PATIENT_CRITICAL_INDICATORS_FACED_EVENT)
  async handlePatientCriticalIndicatorsFacedEvent(event: PatientCriticalIndicatorsFacedEvent) {
    const { patientId, doctorId, criticalSurveyAnswersIds, surveyTemplateId } = event;
    const criticalSurveyAnswers = await this.surveyAnswersRepository.find({
      where: { id: In(criticalSurveyAnswersIds) },
      relations: ['question', 'answerQuestionOption'],
    });

    const questionsWithAnswersPromises = criticalSurveyAnswers.map(async (criticalSurveyAnswer) => {
      const { question } = criticalSurveyAnswer;
      const { title: questionTitle } = question;

      let questionAnswer;
      if (question.type === QuestionType.CHECKBOX) {
        const answerQuestionOptions = await this.questionOptionsRepository.findByIds(
          criticalSurveyAnswer.answerQuestionOptionsIds,
        );
        const answerQuestionOptionsTexts = answerQuestionOptions.map(
          (answerQuestionOption) => answerQuestionOption.text,
        );

        questionAnswer = answerQuestionOptionsTexts.join(', ');
      } else if (question.type === QuestionType.RADIO) {
        questionAnswer = criticalSurveyAnswer.answerQuestionOption.text;
      } else if (question.type === QuestionType.PRESSURE) {
        const pressure = criticalSurveyAnswer.answerValue[QuestionType.PRESSURE];
        questionAnswer = `${pressure.upperValue} / ${pressure.lowerValue}`;
      } else {
        type NumerableValue =
          | SurveyWeightAnswerValue
          | SurveyPulseAnswerValue
          | SurveyNumericAnswerValue
          | SurveyScaleAnswerValue
          | SurveyTemperatureAnswerValue;

        const numerableValue = criticalSurveyAnswer.answerValue[question.type] as NumerableValue;
        questionAnswer = numerableValue.value;
      }
      return { questionTitle, questionAnswer };
    });
    const questionsWithAnswers = await Promise.all(questionsWithAnswersPromises);

    const { hospitalId } = await this.hospitalsDoctorsRepository.findOne({
      where: {
        doctorId,
      },
    });
    const hospitalPatient = await this.hospitalsPatientsRepository.findOne({
      where: {
        patientId,
        hospitalId,
      },
    });
    const questionsWithAnswersStrings = questionsWithAnswers.map(
      (questionWithAnswer) => `${questionWithAnswer.questionTitle}: ${questionWithAnswer.questionAnswer}`,
    );
    this.doctorNotificationsRepository.save({
      title: `Превышение критического уровня`,
      description: `У вашего пациента #${
        hospitalPatient.medicalCardNumber
      } превышен критический уровень следующих показателей\n${questionsWithAnswersStrings.join('\n')}`,
      patientId,
      doctorId,
      kind: DoctorNotificationKind.CRITICAL_INDICATORS,
      extraData: { surveyTemplateId },
    });

    // updates
    const doctor = await this.doctorRepository.findOne(doctorId);
    const patient = await this.patientsRepository.findOne({ where: { id: patientId } });

    this.notificationClient
      .send({
        type: 'criticalindicators',
        payload: {
          patientId: patientId,
          email: patient.email,
          medicalCardNumber: hospitalPatient.medicalCardNumber,
          firstName: hospitalPatient.firstName,
          lastName: hospitalPatient.lastName,
        },
        tgChatId: doctor.tgChatId,
      })
      .catch((e) => {});

    // if (doctor.notificationsSettings.criticalIndicators) {
    //   const { email } = doctor;
    //   this.doctorEmailNotificationService.sendCriticalIndicatorsEmail(
    //     email,
    //     hospitalPatient.medicalCardNumber,
    //     questionsWithAnswersStrings,
    //     patientId,
    //   );
    // }
  }

  async removeDoctorNotification(doctorId: string, doctorNotificationId: string) {
    const notification = await this.doctorNotificationsRepository.findOne({
      where: {
        doctorId,
        id: doctorNotificationId,
      },
    });
    if (!notification) {
      throw new BadRequestException('Notification not found');
    }
    await this.doctorNotificationsRepository.remove(notification);
    return true;
  }

  async getUnreadNotificationsCount(doctorId: string) {
    const unreadNotificationsCount = await this.doctorNotificationsRepository.count({
      where: {
        doctorId,
        isRead: false,
      },
    });
    return unreadNotificationsCount;
  }

  async readAllNotifications(doctorId: string) {
    const unreadNotificationsCount = await this.getUnreadNotificationsCount(doctorId);
    if (unreadNotificationsCount === 0) {
      throw new BadRequestException(`You don't have unread notifications`);
    }
    await this.doctorNotificationsRepository.update({ isRead: false }, { isRead: true });
    return true;
  }
}
