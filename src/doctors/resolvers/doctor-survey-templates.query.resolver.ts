import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { UsersRole } from 'src/common/types/users.types';
import { SurveyTemplateModel } from 'src/survey-templates/models';

import { DoctorSurveyTemplatesService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class DoctorSurveyTemplatesQueryResolver {
  constructor(private readonly doctorSurveyTemplatesService: DoctorSurveyTemplatesService) {}

  @Query(() => [SurveyTemplateModel], {
    description: 'Retrieve public survey templates for patient',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorFindPatientPublicSurveyTemplates(
    @Args('patientId', {
      type: () => UUID,
    })
    patientId: string,
    @IAM('id') doctorId: string,
  ) {
    const surveyTemplates = await this.doctorSurveyTemplatesService.findPatientPublicSurveyTemplates(
      doctorId,
      patientId,
    );
    return surveyTemplates.map(SurveyTemplateModel.create);
  }

  @Query(() => [SurveyTemplateModel], {
    description: 'Retrieve private survey templates for patient',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorFindPatientPrivateSurveyTemplates(
    @Args('patientId', {
      type: () => UUID,
    })
    patientId: string,
    @IAM('id') doctorId: string,
  ) {
    const surveyTemplates = await this.doctorSurveyTemplatesService.findPatientPrivateSurveyTemplates(
      doctorId,
      patientId,
    );
    return surveyTemplates.map(SurveyTemplateModel.create);
  }
}
