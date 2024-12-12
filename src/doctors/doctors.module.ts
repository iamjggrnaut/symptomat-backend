import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudCacheStorageModule } from '@purrweb/cloud-cache-storage';
import { redisFactory } from 'src/common/factories';
import { DrugsQuestionsRepository } from 'src/drugs/repositories';
import { HospitalManagersRepository } from 'src/hospital-managers/repository/hospital-managers.repository';
import { HospitalsModule } from 'src/hospitals/hospitals.module';
import {
  HospitalsDoctorsRepository,
  HospitalsPatientsRepository,
  HospitalsRepository,
} from 'src/hospitals/repositories';
import { PatientsRepository } from 'src/patients/repositories';
import { QuestionOptionsRepository, QuestionsRepository } from 'src/questions/repositories';
import { QuestionsService } from 'src/questions/services/questions.service';
import {
  SurveyTemplatesDrugsRepository,
  SurveyTemplatesQuestionsRepository,
  SurveyTemplatesRepository,
} from 'src/survey-templates/repositories';
import { SurveyAnswersRepository, SurveysRepository } from 'src/surveys/repositories';

import { UsersAuthService } from '../common/services/users-auth.service';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  DoctorInvitationsRepository,
  DoctorNotificationRepository,
  DoctorRepository,
  DoctorsPatientsRepository,
} from './repositories';
import {
  DoctorNotificationsMutationResolver,
  DoctorNotificationsQueryResolver,
  DoctorSurveyTemplatesMutationResolver,
  DoctorSurveyTemplatesQueryResolver,
  DoctorSurveysMutationResolver,
  DoctorSurveysQueryResolver,
} from './resolvers';
import { DoctorsMutationResolver } from './resolvers/doctor.mutation.resolver';
import { DoctorQueryResolver } from './resolvers/doctor.query.resolver';
import { DoctorResolver } from './resolvers/doctor.resolver';
import { DoctorSurveyTemplatesService, DoctorSurveysService } from './services';
import { DoctorEmailAuthService } from './services/doctor-email-auth.service';
import { DoctorEmailNotificationService } from './services/doctor-email-notification.service';
import { DoctorNotificationsService } from './services/doctor-notifications.service';
import { DoctorService } from './services/doctor.service';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([
      HospitalManagersRepository,
      HospitalsDoctorsRepository,
      DoctorNotificationRepository,
      DoctorsPatientsRepository,
      DoctorRepository,
      HospitalsRepository,
      SurveysRepository,
      SurveyTemplatesRepository,
      SurveyTemplatesDrugsRepository,
      SurveyTemplatesQuestionsRepository,
      QuestionsRepository,
      HospitalsDoctorsRepository,
      DoctorsPatientsRepository,
      HospitalsPatientsRepository,
      PatientsRepository,
      SurveyAnswersRepository,
      QuestionOptionsRepository,
      DrugsQuestionsRepository,
      DoctorInvitationsRepository,
    ]),
    HospitalsModule,
    CloudCacheStorageModule.forRootAsync(redisFactory),
  ],
  providers: [
    DoctorService,
    UsersAuthService,
    DoctorEmailAuthService,
    DoctorEmailNotificationService,
    DoctorSurveyTemplatesService,
    QuestionsService,
    DoctorSurveysService,
    DoctorResolver,
    DoctorsMutationResolver,
    DoctorQueryResolver,
    DoctorSurveyTemplatesQueryResolver,
    DoctorSurveyTemplatesMutationResolver,
    DoctorSurveysQueryResolver,
    DoctorSurveysMutationResolver,
    DoctorNotificationsService,
    DoctorNotificationsQueryResolver,
    DoctorNotificationsMutationResolver,
  ],
  exports: [DoctorEmailAuthService, UsersAuthService],
})
export class DoctorsModule {}
