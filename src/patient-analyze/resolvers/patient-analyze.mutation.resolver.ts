import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { UsersRole } from 'src/common/types';
import { Doctor } from 'src/doctors/entities';
import { Patient } from 'src/patients/entities';
import { PatientAnalyzesService } from 'src/patients/services';

import { CreateAnalyzesInput } from '../inputs/patient-create-analyzes.input';
import { PatientAnalyzeModel } from '../model/patient-anylize.model';
import { PatientCreateSignedUrlPayload } from '../payloads/patient-create-signed-url.payload';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class PatientAnalyzeMutationResolver {
  constructor(private readonly patientAnalyzesService: PatientAnalyzesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PatientCreateSignedUrlPayload, {
    description: 'create signed url',
  })
  async createSignedUrl(
    @Args('filename', {
      type: () => String,
      description: 'filename',
    })
    filename: string,
  ) {
    const fileInfo = await this.patientAnalyzesService.createSignedUrl(filename);

    return PatientCreateSignedUrlPayload.create(fileInfo);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [PatientAnalyzeModel], {
    description: 'create patient analyzes',
  })
  async createPatientAnalyze(
    @IAM() patient: Patient,
    @Args('input', {
      type: () => CreateAnalyzesInput,
      description: 'input',
    })
    input: CreateAnalyzesInput,
  ) {
    const patientAnalyzes = await this.patientAnalyzesService.createPatientAnalyze(input, patient.id);
    return patientAnalyzes.map(PatientAnalyzeModel.create);
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Mutation(() => Boolean, {
    description: 'Mark all patient analyzes as viewed',
  })
  doctorMarkPatientAnalyzesAsViewed(
    @IAM()
    doctor: Doctor,
    @Args('patientId')
    patientId: string,
  ) {
    return this.patientAnalyzesService.markPatientAnalyzesAsViewed(doctor.id, patientId);
  }
}
