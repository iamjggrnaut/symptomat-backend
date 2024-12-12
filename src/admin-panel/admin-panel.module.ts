import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsRepository } from 'src/admins/admin.repository';
import { DoctorRepository } from 'src/doctors/repositories';
import { DrugsQuestionsRepository, DrugsRepository } from 'src/drugs/repositories';
import { PatientsRepository } from 'src/patients/repositories/patients.repository';
import { QuestionCategoriesRepository } from 'src/question-categories/question-categories.repository';
import { QuestionCategoryQuestionsRepository, QuestionsRepository } from 'src/questions/repositories';

import { HospitalManagersModule } from '../hospital-managers/hospital-managers.module';
import { HospitalManagersRepository } from '../hospital-managers/repository/hospital-managers.repository';
import { HospitalsPatientsRepository, HospitalsRepository } from '../hospitals/repositories';
import { DrugsXlsController } from './controllers/drugs-xls.controller';
import { HospitalManagersCrudController } from './controllers/hospital-managers.crud.controller';
import { HospitalsCrudController } from './controllers/hospital.crud.controller';
import { PatientsCrudController } from './controllers/patients.crud.controller';
import { DrugsXlsService } from './services/drugs-xls.service';
import { HospitalManagersCrudService } from './services/hospital-managers.crud.service';
import { HospitalsCrudService } from './services/hospital.crud.service';
import { PatientsCrudService } from './services/patients.crud.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminsRepository,
      PatientsRepository,
      HospitalManagersRepository,
      HospitalsRepository,
      HospitalsPatientsRepository,
      DoctorRepository,
      DrugsRepository,
      QuestionsRepository,
      DrugsQuestionsRepository,
      QuestionCategoriesRepository,
      QuestionCategoryQuestionsRepository,
    ]),
    HospitalManagersModule,
  ],
  providers: [PatientsCrudService, HospitalManagersCrudService, HospitalsCrudService, DrugsXlsService],
  controllers: [PatientsCrudController, HospitalManagersCrudController, HospitalsCrudController, DrugsXlsController],
})
export class AdminPanelModule {}
