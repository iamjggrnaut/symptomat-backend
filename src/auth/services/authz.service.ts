import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/admins/admin.entity';
import { AdminsRepository } from 'src/admins/admin.repository';
import { JwtPayload } from 'src/auth/auth.types';
import { HospitalManager } from 'src/hospital-managers/entities/hospital-managers.entity';
import { HospitalManagersRepository } from 'src/hospital-managers/repository/hospital-managers.repository';
import { Patient } from 'src/patients/entities/patient.entity';
import { PatientsRepository } from 'src/patients/repositories';

import { Doctor } from '../../doctors/entities';
import { DoctorRepository } from '../../doctors/repositories';
import { TOKEN_TYPE } from '../auth.enums';

@Injectable()
export class AuthZService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly patientsRepository: PatientsRepository,
    private readonly adminRepository: AdminsRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly managerRepository: HospitalManagersRepository,
  ) {}

  async verifyTokenAsync(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);
  }

  async validatePatient(payload: JwtPayload): Promise<Patient> {
    return this.patientsRepository.findOne(payload.id);
  }

  async validateAdmin(payload: JwtPayload): Promise<Admin> {
    return await this.adminRepository.findOne({ id: payload.id });
  }

  async validateDoctor(payload: JwtPayload): Promise<Doctor> {
    return await this.doctorRepository.findOne({ id: payload.id });
  }

  async validateManager(payload: JwtPayload): Promise<HospitalManager> {
    return await this.managerRepository.findOne({ id: payload.id });
  }

  async validate(payload: JwtPayload) {
    switch (payload.tokenType) {
      case TOKEN_TYPE.patient:
        return this.validatePatient(payload);

      case TOKEN_TYPE.admin:
        return this.validateAdmin(payload);

      case TOKEN_TYPE.doctor:
        return this.validateDoctor(payload);

      case TOKEN_TYPE.manager:
        return this.validateManager(payload);

      default:
        throw new Error(`Invalid token type ${payload.tokenType}`);
    }
  }
}
