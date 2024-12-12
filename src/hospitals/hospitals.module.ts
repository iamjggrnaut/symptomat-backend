import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HospitalsDoctorsRepository, HospitalsPatientsRepository } from './repositories';
import { HospitalsRepository } from './repositories/hospitals.repository';
import { HospitalsService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalsRepository, HospitalsDoctorsRepository, HospitalsPatientsRepository])],
  providers: [HospitalsService],
  exports: [HospitalsService],
})
export class HospitalsModule {}
