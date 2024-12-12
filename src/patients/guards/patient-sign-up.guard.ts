import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalsDoctorsRepository, HospitalsPatientsRepository } from 'src/hospitals/repositories';

import { PatientsRepository } from '../repositories/patients.repository';

@Injectable()
export class PatientSignUpGuard implements CanActivate {
  constructor(
    @InjectRepository(PatientsRepository)
    private readonly patientsRepository: PatientsRepository,
    private readonly hospitalsPatientsRepository: HospitalsPatientsRepository,
    private readonly hospitalsDoctorsRepository: HospitalsDoctorsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const email = ctx.getArgs().input.email;
    const medicalCardNumber = ctx.getArgs().input.medicalCardNumber;
    const doctor = request.user;

    const { hospitalId } = await this.hospitalsDoctorsRepository.findOneOrFail({
      where: {
        doctorId: doctor.id,
      },
    });

    const existedPatientWithMedicalCardNumber = await this.hospitalsPatientsRepository.findOneActualHospitalPatient({
      where: { hospitalId, medicalCardNumber },
    });

    if (existedPatientWithMedicalCardNumber) {
      throw new BadRequestException('User with this medical card number is already registered in this hospital');
    }

    const patient = await this.patientsRepository.findOneActualPatient({
      where: { email },
    });

    if (!patient) {
      return true;
    }

    const existedPatientWithEmail = await this.hospitalsPatientsRepository.findOneActualHospitalPatient({
      where: { hospitalId, patientId: patient.id },
    });
    if (existedPatientWithEmail) {
      throw new BadRequestException('User with this email is already registered in this hospital');
    }
    return true;
  }
}
