import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { UsersRole } from 'src/common/types';
import { SurveyModel } from 'src/surveys/models';

import { PatientSurveysService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class PatientSurveysQueryResolver {
  constructor(private readonly patientSurveysService: PatientSurveysService) {}

  @Query(() => SurveyModel, {
    nullable: true,
    description: 'Retrieve active patient survey',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientFindActiveSurvey(@IAM('id') patientId: string) {
    const survey = await this.patientSurveysService.findActiveSurvey(patientId);
    if (!survey) {
      return null;
    }
    return SurveyModel.create(survey);
  }
}
