import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/doctors/entities';

import { Hospital } from '../entities';
import { HospitalsDoctorsRepository, HospitalsPatientsRepository, HospitalsRepository } from '../repositories';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(HospitalsRepository)
    private readonly hospitalsRepository: HospitalsRepository,
    @InjectRepository(HospitalsDoctorsRepository)
    private readonly hospitalsDoctorsRepository: HospitalsDoctorsRepository,
    @InjectRepository(HospitalsPatientsRepository)
    private readonly hospitalsPatientsRepository: HospitalsPatientsRepository,
  ) {}

  async getHospitalPatientCount(hospitalId: Hospital['id']): Promise<number> {
    return this.hospitalsPatientsRepository.countActualHospitalPatient({ where: { hospitalId } });
  }

  async getHospitalLimit(hospitalId: Hospital['id']): Promise<number> {
    const hospital = await this.hospitalsRepository.findOne({ where: { id: hospitalId } });
    return hospital.patientsLimit;
  }

  async hospitalPatientsLimitNotExhausted(doctorId: Doctor['id']): Promise<boolean> {
    const { hospitalId } = await this.hospitalsDoctorsRepository.findOne({ where: { doctorId } });
    const patientsCount = await this.getHospitalPatientCount(hospitalId);
    const limit = await this.getHospitalLimit(hospitalId);
    return patientsCount < limit;
  }
}
