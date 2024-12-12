import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { SentryInterceptor } from 'src/common/interceptors';
import { UsersRole } from 'src/common/types';

import { PatientCompleteSurveyGuard } from '../guards';
import { PatientCompleteSurveyInput } from '../inputs';
import { PatientCompleteSurveyPayload } from '../payloads';
import { PatientSurveysService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class PatientSurveysMutationResolver {
  constructor(private readonly patientSurveysService: PatientSurveysService) {}

  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard, PatientCompleteSurveyGuard)
  @Mutation(() => PatientCompleteSurveyPayload, {
    description: 'Complete survey as patient',
  })
  async patientCompleteSurvey(
    @Args({ name: 'input', type: () => PatientCompleteSurveyInput })
    input: PatientCompleteSurveyInput,
  ) {
    return PatientCompleteSurveyPayload.catchProblems(PatientCompleteSurveyPayload, async () => {
      await this.patientSurveysService.completeSurvey(input);
      return PatientCompleteSurveyPayload.create({ success: true });
    });
  }
}
