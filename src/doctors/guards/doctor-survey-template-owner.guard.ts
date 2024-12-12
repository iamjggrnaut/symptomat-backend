import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Doctor } from 'src/doctors/entities';
import { SurveyTemplatesRepository } from 'src/survey-templates/repositories';

@Injectable()
export class DoctorSurveyTemplateOwnerGuard implements CanActivate {
  constructor(private readonly surveyTemplatesRepository: SurveyTemplatesRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const doctor = request.user as Doctor;
    const surveyTemplateId = ctx.getArgs().id;
    const surveyTemplate = await this.surveyTemplatesRepository.findOne(surveyTemplateId);
    if (!surveyTemplate) {
      throw new BadRequestException('Survey template not found');
    }
    const { doctorId } = surveyTemplate;
    if (doctorId !== doctor.id) {
      throw new BadRequestException("It's not your survey template");
    }
    return true;
  }
}
