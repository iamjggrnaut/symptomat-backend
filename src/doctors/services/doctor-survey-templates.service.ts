import { Injectable } from '@nestjs/common';
import { SurveyTemplate } from 'src/survey-templates/entities';
import {
  SurveyTemplatesDrugsRepository,
  SurveyTemplatesQuestionsRepository,
  SurveyTemplatesRepository,
} from 'src/survey-templates/repositories';
import { SurveyTemplateKind, SurveyTemplateStatus } from 'src/survey-templates/survey-templates.types';
import { SurveysRepository } from 'src/surveys/repositories';
import { SurveyStatus } from 'src/surveys/surveys.types';

import { DoctorCreateSurveyTemplateInput } from '../inputs';
import { PatientsRepository } from 'src/patients/repositories';
import { NotificationHttpClient } from 'src/telegram/notification.http.client';
import { HospitalsPatientsRepository } from 'src/hospitals/repositories';

@Injectable()
export class DoctorSurveyTemplatesService {
  constructor(
    private readonly surveysRepository: SurveysRepository,
    private readonly patientRepository: PatientsRepository,
    private readonly hospitalPatientRepository: HospitalsPatientsRepository,
    private readonly surveyTemplatesRepository: SurveyTemplatesRepository,
    private readonly surveyTemplatesDrugsRepository: SurveyTemplatesDrugsRepository,
    private readonly surveyTemplatesQuestionsRepository: SurveyTemplatesQuestionsRepository,
    private readonly notificationClient: NotificationHttpClient
  ) {}

  async findOne(surveyTemplateId: string) {
    return this.surveyTemplatesRepository.findOne(surveyTemplateId);
  }

  async create(
    doctorId: string,
    input: DoctorCreateSurveyTemplateInput,
    kind: SurveyTemplateKind,
  ): Promise<SurveyTemplate> {
    // save template
    const surveyTemplate = this.surveyTemplatesRepository.create({
      doctorId,
      title: input.title,
      startAt: input.startAt,
      endAt: input.endAt,
      period: input.period,
      patientId: input.patientId,
      kind,
      timezoneOffset: input.timezoneOffset,
    });
    await this.surveyTemplatesRepository.save(surveyTemplate);

    // save template drugs
    const surveyTemplateDrugs = input.drugsIds.map((drugId) => {
      return this.surveyTemplatesDrugsRepository.create({
        drugId,
        templateId: surveyTemplate.id,
      });
    });
    await this.surveyTemplatesDrugsRepository.save(surveyTemplateDrugs);

    // save template questions
    const surveyTemplateQuestions = input.questions.map((question) => {
      return this.surveyTemplatesQuestionsRepository.create({
        templateId: surveyTemplate.id,
        questionId: question.questionId,
        criticalIndicators: question.criticalIndicators,
        criticalAnswerId: question.criticalAnswerId,
        criticalAnswersIds: question.criticalAnswersIds,
      });
    });
    await this.surveyTemplatesQuestionsRepository.save(surveyTemplateQuestions);

    return surveyTemplate;
  }

  async createPublic(doctorId: string, input: DoctorCreateSurveyTemplateInput): Promise<SurveyTemplate> {
    return this.create(doctorId, input, SurveyTemplateKind.PUBLIC);
  }

  async createPrivate(doctorId: string, input: DoctorCreateSurveyTemplateInput): Promise<SurveyTemplate> {
    // cancel active survey templates and surveys
    this.surveyTemplatesRepository.update(
      { doctorId, patientId: input.patientId, status: SurveyTemplateStatus.ACTIVE },
      { status: SurveyTemplateStatus.CANCELED },
    );
    this.surveysRepository.update(
      { doctorId, patientId: input.patientId, status: SurveyStatus.ACTIVE },
      { status: SurveyStatus.CANCELED },
    );

    // updates
    const patientId = input.patientId
    const patient = await this.patientRepository.findOne({where: {id: patientId}})
    const hospitalPatient = await this.hospitalPatientRepository.findOne({where: {patientId}})

    const surveyTemplate = await this.create(doctorId, input, SurveyTemplateKind.PRIVATE);
    await this.surveyTemplatesRepository.update(surveyTemplate.id, { status: SurveyTemplateStatus.ACTIVE });
    
    this.notificationClient.send({
      type: 'newsurvey',
      payload: {
        patientId: patientId,
        email: patient.email,
        medicalCardNumber: hospitalPatient.medicalCardNumber,
        firstName: hospitalPatient.firstName,
        lastName: hospitalPatient.lastName
      },
      tgChatId: patient.tgChatId,
    }).catch(e => {});

    return this.surveyTemplatesRepository.findOne(surveyTemplate.id);
  }

  async findPatientPublicSurveyTemplates(doctorId: string, patientId: string): Promise<SurveyTemplate[]> {
    const surveyTemplates = await this.surveyTemplatesRepository.find({
      where: {
        doctorId,
        patientId,
        kind: SurveyTemplateKind.PUBLIC,
      },
    });
    return surveyTemplates;
  }

  async findPatientPrivateSurveyTemplates(doctorId: string, patientId: string): Promise<SurveyTemplate[]> {
    const surveyTemplates = await this.surveyTemplatesRepository.find({
      where: {
        doctorId,
        patientId,
        kind: SurveyTemplateKind.PRIVATE,
      },
    });
    return surveyTemplates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async remove(surveyTemplateId: string) {
    await this.surveyTemplatesRepository.delete(surveyTemplateId);
    return true;
  }
}
