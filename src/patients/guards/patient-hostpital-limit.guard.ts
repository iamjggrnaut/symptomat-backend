import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Doctor } from 'src/doctors/entities';
import { HospitalsService } from 'src/hospitals/services';

@Injectable()
export class PatientHospitalLimitGuard implements CanActivate {
  constructor(private readonly hospitalsService: HospitalsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const user = request.user;

    const doctor = user as Doctor;
    const limitNotExhausted = await this.hospitalsService.hospitalPatientsLimitNotExhausted(doctor.id);
    if (!limitNotExhausted) {
      throw new BadRequestException(
        `The limit on patients in this hospital has been exceeded. Please, contact your hospital manager to increase the limit`,
      );
    }

    return true;
  }
}
