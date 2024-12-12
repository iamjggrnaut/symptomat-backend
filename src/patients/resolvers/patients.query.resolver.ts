import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { DoctorPatientModel } from 'src/doctors/models';
import { HospitalPatientModel } from 'src/hospitals/models';
import { HospitalsPatientsConnection } from 'src/hospitals/models/hospitals-patients-connection.model';

import { UsersRole } from '../../common/types/users.types';
import { PatientsSurveyStatusLoader } from '../dataloaders/patient-survey-status.loader';
import { Patient } from '../entities/patient.entity';
import { MePatientModel } from '../models/me-patient.model';
import { PatientDashboardModel } from '../models/patient-dashboard.model';
import { PatientPressureHistoryConnection } from '../models/patient-pressure-history-connection.model';
import { PatientPulseHistoryConnection } from '../models/patient-pulse-history-connection.model';
import { PatientTemperatureHistoryConnection } from '../models/patient-temperature-history-connection.model';
import { PatientWeightHistoryConnection } from '../models/patient-weight-history-connection.model';
import { EmailArgs, MedicalCardNumberArgs } from '../patients.args';
import { PatientsService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver(() => HospitalPatientModel)
export class PatientsQueryResolver {
  constructor(private readonly patientsService: PatientsService) {}

  @Query(() => MePatientModel, {
    description: 'Retrieve current patient',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientMe(@IAM() patient: Patient) {
    return MePatientModel.create(await this.patientsService.findOne(patient.id));
  }

  @Query(() => Boolean, {
    description: 'Check patient email for uniqueness',
  })
  async patientEmailIsUniq(@Args() { email }: EmailArgs): Promise<boolean> {
    return this.patientsService.emailIsUniq(email);
  }

  @Query(() => Boolean, {
    description: 'Check patient medical card number for uniqueness',
  })
  async patientMedicalCardNumberIsUniq(
    @Args() { medicalCardNumber, hospitalId }: MedicalCardNumberArgs,
  ): Promise<boolean> {
    return this.patientsService.medicalCardNumberIsUniq(medicalCardNumber, hospitalId);
  }

  @Query(() => PatientDashboardModel, {
    description: 'Retrieve patient dashboard',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientDashboard(@IAM('id') patientId: string) {
    const dashboard = await this.patientsService.getDashboard(patientId);
    return PatientDashboardModel.create(dashboard);
  }

  @Query(() => [DoctorPatientModel], {
    description: 'Retrieve patient doctors',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientDoctors(@IAM('id') patientId: string) {
    const patientsDoctors = await this.patientsService.getPatientDoctors(patientId);
    return patientsDoctors.map(DoctorPatientModel.create);
  }

  @Query(() => PatientWeightHistoryConnection, {
    description: 'Retrieve patient weight history',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientGetWeightHistory(
    @IAM('id') patientId: string,
    @Args('first', {
      type: () => Int,
      defaultValue: 4,
      nullable: true,
      description: 'less than or equal 20',
    })
    first?: number,
    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after?: string,
    @Args('startAt', {
      type: () => Date,
      nullable: true,
      description: 'filter from',
    })
    startAt?: Date,
    @Args('endAt', {
      type: () => Date,
      nullable: true,
      description: 'filter to',
    })
    endAt?: Date,
  ) {
    return this.patientsService.getWeightHistory({
      patientId,
      first,
      after,
      startAt,
      endAt,
    });
  }

  @Query(() => PatientPulseHistoryConnection, {
    description: 'Retrieve patient pulse history',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientGetPulseHistory(
    @IAM('id') patientId: string,
    @Args('first', {
      type: () => Int,
      defaultValue: 4,
      nullable: true,
      description: 'less than or equal 20',
    })
    first?: number,
    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after?: string,
    @Args('startAt', {
      type: () => Date,
      nullable: true,
      description: 'filter from',
    })
    startAt?: Date,
    @Args('endAt', {
      type: () => Date,
      nullable: true,
      description: 'filter to',
    })
    endAt?: Date,
  ) {
    return this.patientsService.getPulseHistory({
      patientId,
      first,
      after,
      startAt,
      endAt,
    });
  }

  @Query(() => PatientPressureHistoryConnection, {
    description: 'Retrieve patient pressure history',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientGetPressureHistory(
    @IAM('id') patientId: string,
    @Args('first', {
      type: () => Int,
      defaultValue: 4,
      nullable: true,
      description: 'less than or equal 20',
    })
    first?: number,
    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after?: string,
    @Args('startAt', {
      type: () => Date,
      nullable: true,
      description: 'filter from',
    })
    startAt?: Date,
    @Args('endAt', {
      type: () => Date,
      nullable: true,
      description: 'filter to',
    })
    endAt?: Date,
  ) {
    return this.patientsService.getPressureHistory({
      patientId,
      first,
      after,
      startAt,
      endAt,
    });
  }

  @Query(() => PatientTemperatureHistoryConnection, {
    description: 'Retrieve patient temperature history',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientGetTemperatureHistory(
    @IAM('id') patientId: string,
    @Args('first', {
      type: () => Int,
      defaultValue: 4,
      nullable: true,
      description: 'less than or equal 20',
    })
    first?: number,
    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after?: string,
    @Args('startAt', {
      type: () => Date,
      nullable: true,
      description: 'filter from',
    })
    startAt?: Date,
    @Args('endAt', {
      type: () => Date,
      nullable: true,
      description: 'filter to',
    })
    endAt?: Date,
  ) {
    return this.patientsService.getTemperatureHistory({
      patientId,
      first,
      after,
      startAt,
      endAt,
    });
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Query(() => HospitalsPatientsConnection, {
    description: 'Search patient',
  })
  async searchPatient(
    @IAM('id') doctorId: string,
    @Args('first', {
      type: () => Int,
      defaultValue: 4,
      nullable: true,
      description: 'less than or equal 20',
    })
    first?: number,
    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after?: string,
    @Args('filter', {
      type: () => String,
      description: 'filter',
    })
    filter?: string,
  ) {
    return this.patientsService.searchPatient({
      doctorId,
      after,
      first,
      filter,
    });
  }

  @ResolveField(() => String)
  async hasActiveSurvey(
    @Parent()
    hospitalPatientModel: HospitalPatientModel,
    @Loader(PatientsSurveyStatusLoader.name)
    patientsSurveyStatusLoader: Dataloader<string, string>,
  ) {
    const hasActiveSurvey = await patientsSurveyStatusLoader.load(hospitalPatientModel.patientId);
    return hasActiveSurvey;
  }
}
