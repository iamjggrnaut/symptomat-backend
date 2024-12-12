import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { SearchOrder, UsersRole } from 'src/common/types/users.types';
import { PatientAnalyzesService } from 'src/patients/services';

import { PatientAnalyzeConnection } from '../model/patient-anylize-connection.model';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class PatientsAnalyzeQueryResolver {
  constructor(private readonly patientAnalyzesService: PatientAnalyzesService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => String)
  async getSignedUrl(
    @Args('fileKey', {
      type: () => String,
      description: 'fileKey',
    })
    fileKey: string,
  ) {
    return this.patientAnalyzesService.getSignedUrl(fileKey);
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Query(() => PatientAnalyzeConnection, {
    description: 'Search patient analyze',
  })
  async searchPatientAnalyzes(
    @IAM('id') doctorId: string,
    @Args('patientId', {
      type: () => String,
      description: 'patientId',
    })
    patientId: string,
    @Args('first', {
      type: () => Int,
      defaultValue: 4,
      nullable: true,
      description: 'less than or equal 20',
    })
    first?: number,
    @Args('orderBy', {
      type: () => SearchOrder,
      nullable: true,
      defaultValue: SearchOrder.DESC,
    })
    orderBy?: SearchOrder,
    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after?: string,
    @Args('startAt', {
      type: () => Date,
      nullable: true,
      description: 'startAt',
    })
    startAt?: Date,
    @Args('endAt', {
      type: () => Date,
      nullable: true,
      description: 'endAt',
    })
    endAt?: Date,
  ) {
    return this.patientAnalyzesService.searchPatientAnalyzes({
      doctorId,
      patientId,
      orderBy,
      first,
      after,
      startAt,
      endAt,
    });
  }

  @Query(() => Int, {
    description: 'Retrieve new patient analyzes count',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorGetNewPatientAnalyzesCount(
    @IAM('id') doctorId: string,
    @Args('patientId')
    patientId: string,
  ) {
    return this.patientAnalyzesService.getNewPatientAnalyzesCount(doctorId, patientId);
  }
}
