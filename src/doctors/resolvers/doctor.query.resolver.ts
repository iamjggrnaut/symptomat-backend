import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { HospitalManager } from 'src/hospital-managers/entities/hospital-managers.entity';
import { HospitalPatientModel } from 'src/hospitals/models';
import { HospitalsService } from 'src/hospitals/services';
import { EmailArgs } from 'src/patients/patients.args';
import { Question } from 'src/questions/entities';
import { QuestionModel } from 'src/questions/models';
import { QuestionsService } from 'src/questions/services/questions.service';

import { UserRoles } from '../../auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from '../../auth/guards';
import { IAM } from '../../common/decorators';
import { SentryInterceptor } from '../../common/interceptors';
import { SearchOrder, UsersRole } from '../../common/types/users.types';
import { Doctor } from '../entities';
import { DoctorQuestionOwnerGuard } from '../guards/doctor-question.guard';
import { DoctorConnection } from '../models/doctor-connection';
import { DoctorModel } from '../models/doctor.model';
import { DoctorService } from '../services/doctor.service';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class DoctorQueryResolver {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly questionsService: QuestionsService,
    private readonly hospitalsService: HospitalsService,
  ) {}

  @Query(() => DoctorModel, {
    description: 'Retrieve current doctor',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorMe(@IAM() doctor) {
    return DoctorModel.create(await this.doctorService.findOne(doctor.id));
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.MANAGER)
  @Query(() => DoctorConnection, {
    description: 'Search doctors',
  })
  async searchDoctors(
    @IAM() manager: HospitalManager,
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
      defaultValue: SearchOrder.ASC,
    })
    orderBy?: SearchOrder,
    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after?: string,
    @Args('filter', {
      type: () => String,
      nullable: true,
      description: 'filter',
    })
    filter?: string,
  ) {
    return this.doctorService.searchDoctors({
      hospitalId: manager.hospitalId,
      after,
      first,
      filter,
      orderBy,
    });
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Query(() => [QuestionModel], {
    description: 'Find questions by title and category id',
  })
  async doctorSearch(
    @IAM() doctor: Doctor,
    @Args('title') title: string,
    @Args('categoryId', { nullable: true })
    categoryId?: string,
  ): Promise<Question[]> {
    return this.questionsService.findByTitleAndCategoryId(title, doctor.id, categoryId);
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard, DoctorQuestionOwnerGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Query(() => QuestionModel, {
    description: 'Find question by id',
  })
  async doctorFindQuestionById(@Args('id') id: string): Promise<Question> {
    return this.questionsService.findById(id);
  }

  @Query(() => HospitalPatientModel, {
    description: 'Retrieve hospital patient for current doctor',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorFindHospitalPatient(
    @IAM('id')
    doctorId: string,
    @Args('patientId', { type: () => UUID })
    patientId: string,
  ) {
    const hospitalPatient = await this.doctorService.findHospitalPatient(doctorId, patientId);
    return HospitalPatientModel.create(hospitalPatient);
  }

  @Query(() => Boolean, {
    description:
      'Check hospital limit before creating a patient. If result is true, doctor can add patient, if false - limit is exhausted',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async hospitalLimitNotExhausted(@IAM('id') doctorId: string): Promise<boolean> {
    return this.hospitalsService.hospitalPatientsLimitNotExhausted(doctorId);
  }

  @Query(() => Boolean, {
    description: 'Check doctor email for uniqueness',
  })
  async doctorEmailIsUniq(@Args() { email }: EmailArgs): Promise<boolean> {
    return this.doctorService.emailIsUniq(email);
  }
}
