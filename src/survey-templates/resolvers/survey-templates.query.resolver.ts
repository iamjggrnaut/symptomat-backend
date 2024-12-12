import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { SentryInterceptor } from 'src/common/interceptors';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { UsersRole } from 'src/common/types';
import { DoctorSurveyTemplateOwnerGuard } from 'src/doctors/guards/doctor-survey-template-owner.guard';

import { SurveyTemplateModel } from '../models';
import { SurveyTemplatesService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class SurveyTemplatesQueryResolver {
  constructor(private readonly surveyTemplatesService: SurveyTemplatesService) {}

  @Query(() => SurveyTemplateModel, {
    description: 'Retrieve one survey template',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard, DoctorSurveyTemplateOwnerGuard)
  async surveyTemplateFindOne(
    @Args('id', {
      type: () => UUID,
    })
    surveyTemplateId: string,
  ) {
    const surveyTemplate = await this.surveyTemplatesService.findOne(surveyTemplateId);
    return SurveyTemplateModel.create(surveyTemplate);
  }
}
