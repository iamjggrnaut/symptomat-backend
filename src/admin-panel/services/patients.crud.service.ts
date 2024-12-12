import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { PatientsRepository } from 'src/patients/repositories';

@Injectable()
export class PatientsCrudService extends TypeOrmCrudService<Patient> {
  constructor(
    @InjectRepository(PatientsRepository)
    readonly repository: PatientsRepository,
  ) {
    super(repository);
  }
}
