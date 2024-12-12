import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppleAuthMobileModule } from '@purrweb/apple-auth-mobile';
import { CloudCacheStorageModule } from '@purrweb/cloud-cache-storage';
import { CloudFilesStorageModule } from '@purrweb/cloud-files-storage';
import { FbAuthMobileModule } from '@purrweb/fb-auth-mobile';
import { FirebaseModule } from '@purrweb/firebase';
import { redisFactory } from 'src/common/factories';
import { S3ConfigService } from 'src/common/services';
import { DoctorRepository, DoctorsPatientsRepository } from 'src/doctors/repositories';
import { HospitalsModule } from 'src/hospitals/hospitals.module';
import { HospitalsDoctorsRepository, HospitalsPatientsRepository } from 'src/hospitals/repositories';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PatientSurveyAnswersValidatorModule } from 'src/patient-survey-answers-validator/patient-survey-answers-validator.module';
import { QuestionsRepository } from 'src/questions/repositories';
import { SurveyTemplatesQuestionsRepository } from 'src/survey-templates/repositories';
import { SurveyAnswersRepository, SurveysRepository } from 'src/surveys/repositories';

import { UsersAuthService } from '../common/services/users-auth.service';
import { PatientAnalyzesRepository } from '../patient-analyze/repositories/patient-analyzes.repository';
import { PatientNotificationsRepository, PatientsRepository } from './repositories';
import {
  MePatientResolver,
  PatientNotificationsMutationResolver,
  PatientSurveysMutationResolver,
  PatientSurveysQueryResolver,
  PatientsMutationResolver,
  PatientsQueryResolver,
} from './resolvers';
import { PatientNotificationsQueryResolver } from './resolvers/patient-notifications.query.resolver';
import { PatientAnalyzesService, PatientEmailAuthService, PatientSurveysService, PatientsService } from './services';
import { FirebaseConfigService } from './services/firebase-config.service';
import { PatientEmailNotificationService } from './services/patient-email-notification.service';
import { PatientNotificationsService } from './services/patient-notifications.service';
import { PatientPushNotificationsService } from './services/patient-push-notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HospitalsDoctorsRepository,
      PatientsRepository,
      DoctorRepository,
      HospitalsPatientsRepository,
      PatientNotificationsRepository,
      PatientAnalyzesRepository,
      DoctorsPatientsRepository,
      SurveysRepository,
      SurveyAnswersRepository,
      SurveyTemplatesQuestionsRepository,
      QuestionsRepository,
    ]),
    HospitalsModule,
    NotificationsModule,
    AppleAuthMobileModule,
    FbAuthMobileModule,
    CloudFilesStorageModule.forRootAsync({
      useClass: S3ConfigService,
    }),
    CloudCacheStorageModule.forRootAsync(redisFactory),
    PatientSurveyAnswersValidatorModule,
    FirebaseModule.forRootAsync({
      useClass: FirebaseConfigService,
    }),
  ],
  providers: [
    PatientSurveysService,
    PatientAnalyzesService,
    PatientsService,
    UsersAuthService,
    MePatientResolver,
    PatientsQueryResolver,
    PatientsMutationResolver,
    PatientEmailAuthService,
    PatientSurveysQueryResolver,
    PatientSurveysMutationResolver,
    PatientEmailNotificationService,
    PatientsQueryResolver,
    PatientNotificationsQueryResolver,
    PatientNotificationsService,
    PatientNotificationsMutationResolver,
    PatientPushNotificationsService,
  ],
  exports: [],
})
export class PatientsModule {}
