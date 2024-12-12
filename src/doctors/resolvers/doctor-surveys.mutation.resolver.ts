import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { UsersRole } from 'src/common/types/users.types';

import { DoctorSurveysService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class DoctorSurveysMutationResolver {
  constructor(private readonly doctorSurveysService: DoctorSurveysService) {}

  @Mutation(() => Boolean, {
    description: 'Cancel active doctor patient survey',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorCancelActivePatientSurvey(
    @IAM('id') doctorId: string,
    @Args('patientId', {
      type: () => UUID,
    })
    patientId: string,
  ): Promise<boolean> {
    await this.doctorSurveysService.cancelDoctorPatientActiveSurvey(doctorId, patientId);
    return true;
  }
}
