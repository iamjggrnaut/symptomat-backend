import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { HospitalsRepository } from 'src/hospitals/repositories';

@Injectable()
export class HospitalByDoctorLoader {
  constructor(private hospitalsRepository: HospitalsRepository) {}

  generateDataLoader() {
    return new DataLoader((keys: string[]) => {
      return this.hospitalsRepository.getHospitalByDoctorsIds(keys);
    });
  }
}
