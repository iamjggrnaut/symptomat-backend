import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader from 'dataloader';

import { PatientsRepository } from '../repositories/patients.repository';

@Injectable()
export class PatientsLoader {
  constructor(
    @InjectRepository(PatientsRepository)
    private readonly patientsRepository: PatientsRepository,
  ) {}

  generateDataLoader() {
    return new DataLoader(async (ids: string[]) => {
      const patients = await this.patientsRepository.findByIds(Array.from(new Set(ids)));
      return ids.map((id) => patients.find((patient) => patient.id === id));
    });
  }
}
