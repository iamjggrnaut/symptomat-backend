import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorsPatientsRepository } from 'src/doctors/repositories';

import { Patient } from '../entities';
import { PatientsRepository } from '../repositories';

@Injectable()
export class PatientInviteLifetimeGuard implements CanActivate {
  constructor(
    @InjectRepository(PatientsRepository)
    private readonly patientsRepository: PatientsRepository,
    private readonly doctorsPatientsRepository: DoctorsPatientsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const user = request.user;

    const patient = user as Patient;
    if (patient.isFirstSignUp && patient.inviteEndAt < new Date()) {
      await this.doctorsPatientsRepository.removePatientById(patient.id);
      await this.patientsRepository.delete(patient.id);
      throw new BadRequestException(
        'The invite lifetime is over! Please, contact your doctor to send invite to you again!',
      );
    }

    return true;
  }
}
