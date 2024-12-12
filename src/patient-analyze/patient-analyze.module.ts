import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppleAuthMobileModule } from '@purrweb/apple-auth-mobile';
import { CloudCacheStorageModule } from '@purrweb/cloud-cache-storage';
import { CloudFilesStorageModule } from '@purrweb/cloud-files-storage';
import { FbAuthMobileModule } from '@purrweb/fb-auth-mobile';
import { redisFactory } from 'src/common/factories';
import { S3ConfigService } from 'src/common/services';
import { DoctorsPatientsRepository } from 'src/doctors/repositories';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PatientAnalyzesService } from 'src/patients/services';

import { PatientAnalyzesRepository } from './repositories/patient-analyzes.repository';
import { PatientAnalyzeMutationResolver } from './resolvers/patient-analyze.mutation.resolver';
import { PatientsAnalyzeQueryResolver } from './resolvers/patient-analyze.query.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientAnalyzesRepository, DoctorsPatientsRepository]),
    NotificationsModule,
    AppleAuthMobileModule,
    FbAuthMobileModule,
    CloudFilesStorageModule.forRootAsync({
      useClass: S3ConfigService,
    }),
    CloudCacheStorageModule.forRootAsync(redisFactory),
  ],
  providers: [PatientsAnalyzeQueryResolver, PatientAnalyzeMutationResolver, PatientAnalyzesService],
  exports: [],
})
export class PatientAnalyzesModule {}
