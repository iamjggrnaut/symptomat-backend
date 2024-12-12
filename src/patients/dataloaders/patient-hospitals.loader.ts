import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DataLoaderInterface } from 'src/common/types';
import { HospitalPatient } from 'src/hospitals/entities';
import { HospitalsPatientsRepository } from 'src/hospitals/repositories';

@Injectable()
export class PatientHospitalsLoader implements DataLoaderInterface<string, HospitalPatient[]> {
  constructor(private readonly hospitalsPatientsRepository: HospitalsPatientsRepository) {}

  generateDataLoader() {
    return new DataLoader((patientsIds: string[]) => {
      return this.hospitalsPatientsRepository.loadPatientsHospitals(patientsIds);
    });
  }
}
