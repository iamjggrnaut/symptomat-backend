import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SurveyTemplatesRepository } from 'src/survey-templates/repositories';
import { SurveyTemplateStatus } from 'src/survey-templates/survey-templates.types';
import { Not } from 'typeorm';

import { Doctor } from '../entities';
import { DoctorCreateSurveyTemplateInput } from '../inputs';
import { DoctorsPatientsRepository } from '../repositories';

@Injectable()
export class DoctorCreateSurveyTemplateGuard implements CanActivate {
  constructor(
    private readonly doctorsPatientsRepository: DoctorsPatientsRepository,
    private readonly surveyTemplatesRepository: SurveyTemplatesRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const input = ctx.getArgs().input as DoctorCreateSurveyTemplateInput;
    const doctor = request.user as Doctor;

    const doctorPatient = await this.doctorsPatientsRepository.findOne({
      where: {
        doctorId: doctor.id,
        patientId: input.patientId,
      },
    });

    if (!doctorPatient) {
      throw new BadRequestException("It's not your patient!");
    }

    const activeSurveyTemplate = await this.surveyTemplatesRepository.findOne({
      where: {
        patientId: input.patientId,
        status: SurveyTemplateStatus.ACTIVE,
        doctorId: Not(doctor.id),
      },
    });
    if (activeSurveyTemplate) {
      throw new BadRequestException('This patient has active survey from another doctor!');
    }
    return true;
  }
}
