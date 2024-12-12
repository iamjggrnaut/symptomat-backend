import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { BasePayload } from 'src/common/payloads/base/base-payload';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { UsersRole } from 'src/common/types';
import { SurveyTemplateModel } from 'src/survey-templates/models';

import { DoctorCreateSurveyTemplateGuard } from '../guards/doctor-create-survey-template.guard';
import { DoctorSurveyTemplateOwnerGuard } from '../guards/doctor-survey-template-owner.guard';
import { DoctorCreateSurveyTemplateInput } from '../inputs';
import { DoctorCreateSurveyTemplatePayload } from '../payloads';
import { CreateSurveyTemplatePipe } from '../pipes/create-survey-template.pipe';
import { DoctorSurveyTemplatesService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class DoctorSurveyTemplatesMutationResolver {
  constructor(private readonly surveyTemplatesService: DoctorSurveyTemplatesService) {}

  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard, DoctorCreateSurveyTemplateGuard)
  @Mutation(() => DoctorCreateSurveyTemplatePayload, {
    description: 'Create public survey template',
  })
  async doctorCreatePublicSurveyTemplate(
    @IAM('id') doctorId: string,
    @Args({ name: 'input', type: () => DoctorCreateSurveyTemplateInput }, CreateSurveyTemplatePipe)
    input: DoctorCreateSurveyTemplateInput,
  ) {
    return BasePayload.catchProblems(DoctorCreateSurveyTemplatePayload, async () => {
      const surveyTemplate = await this.surveyTemplatesService.createPublic(doctorId, input);
      return DoctorCreateSurveyTemplatePayload.create({
        surveyTemplate: SurveyTemplateModel.create(surveyTemplate),
      });
    });
  }

  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard, DoctorCreateSurveyTemplateGuard)
  @Mutation(() => DoctorCreateSurveyTemplatePayload, {
    description: 'Create private survey template',
  })
  async doctorCreatePrivateSurveyTemplate(
    @IAM('id') doctorId: string,
    @Args({ name: 'input', type: () => DoctorCreateSurveyTemplateInput }, CreateSurveyTemplatePipe)
    input: DoctorCreateSurveyTemplateInput,
  ) {
    return BasePayload.catchProblems(DoctorCreateSurveyTemplatePayload, async () => {
      const surveyTemplate = await this.surveyTemplatesService.createPrivate(doctorId, input);
      return DoctorCreateSurveyTemplatePayload.create({
        surveyTemplate: SurveyTemplateModel.create(surveyTemplate),
      });
    });
  }

  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard, DoctorSurveyTemplateOwnerGuard)
  @Mutation(() => Boolean, {
    description: 'Remove survey template by id',
  })
  async doctorRemoveSurveyTemplate(
    @Args({ name: 'id', type: () => UUID })
    surveyTemplateId: string,
  ) {
    return this.surveyTemplatesService.remove(surveyTemplateId);
  }
}
