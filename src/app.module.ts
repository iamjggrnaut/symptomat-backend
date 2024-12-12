import * as path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import { GraphQLConfigService, TypeOrmConfigService } from 'src/common/services';

import { AdminPanelModule } from './admin-panel/admin-panel.module';
import { AdminsModule } from './admins/admins.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { Language } from './common/types/users.types';
import * as configuration from './config/configuration';
import { commonDataLoaders } from './dataloaders';
import { DoctorsModule } from './doctors/doctors.module';
import { DrugsModule } from './drugs/drugs.module';
import { HealthController } from './health/health.controller';
import { HospitalManagersModule } from './hospital-managers/hospital-managers.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { HospitalsPatientsRepository, HospitalsRepository } from './hospitals/repositories';
import { PatientAnalyzesModule } from './patient-analyze/patient-analyze.module';
import { PatientAnalyzesRepository } from './patient-analyze/repositories/patient-analyzes.repository';
import { PatientSurveyAnswersValidatorModule } from './patient-survey-answers-validator/patient-survey-answers-validator.module';
import { PatientsModule } from './patients/patients.module';
import { PatientsRepository } from './patients/repositories';
import { QuestionCategoriesModule } from './question-categories/question-categories.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionOptionsRepository } from './questions/repositories';
import {
  SurveyTemplatesDrugsRepository,
  SurveyTemplatesQuestionsRepository,
  SurveyTemplatesRepository,
} from './survey-templates/repositories';
import { SurveyTemplateModule } from './survey-templates/survey-templates.module';
import { SurveyAnswersRepository, SurveysRepository } from './surveys/repositories';
import { SurveysModule } from './surveys/surveys.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration.configuration],
      validationSchema: configuration.validationSchema,
      validationOptions: configuration.validationOptions,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    GraphQLModule.forRootAsync({
      useClass: GraphQLConfigService,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    PatientAnalyzesModule,
    PatientsModule,
    TerminusModule,
    AdminsModule,
    AdminPanelModule,
    HospitalsModule,
    HospitalManagersModule,
    DoctorsModule,
    SurveyTemplateModule,
    QuestionsModule,
    DrugsModule,
    SurveysModule,
    QuestionCategoriesModule,

    TypeOrmModule.forFeature([
      PatientsRepository,
      PatientAnalyzesRepository,
      HospitalsRepository,
      QuestionOptionsRepository,
      SurveyTemplatesQuestionsRepository,
      SurveyTemplatesDrugsRepository,
      SurveysRepository,
      HospitalsPatientsRepository,
      SurveyAnswersRepository,
      SurveyTemplatesRepository,
    ]),

    PatientSurveyAnswersValidatorModule,

    I18nModule.forRoot({
      fallbackLanguage: Language.RU,
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '../i18n'),
      },
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    ...commonDataLoaders,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class AppModule {}
