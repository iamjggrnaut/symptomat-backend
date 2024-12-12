import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { UsersRole } from 'src/common/types/users.types';

import { DoctorPatientSurveyAnswerModel } from '../models';
import { DoctorPatientSurveyAnswerConnection } from '../models/doctor-patient-survey-answer-connection.model';
import { DoctorSurveysService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class DoctorSurveysQueryResolver {
  constructor(private readonly doctorSurveysService: DoctorSurveysService) {}

  @Query(() => [DoctorPatientSurveyAnswerModel], {
    description: 'Retrieve doctor patient survey answers',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorFindPatientSurveyAnswers(
    @IAM('id') doctorId: string,
    @Args('patientId', {
      type: () => UUID,
    })
    patientId: string,
    @Args('surveyTemplateId', {
      type: () => UUID,
      nullable: true,
    })
    surveyTemplateId: string | null,
  ): Promise<DoctorPatientSurveyAnswerModel[]> {
    const surveyTemplateAnswers = await this.doctorSurveysService.findDoctorPatientSurveyAnswers(
      doctorId,
      patientId,
      surveyTemplateId,
    );
    return surveyTemplateAnswers.map(DoctorPatientSurveyAnswerModel.create);
  }

  @Query(() => DoctorPatientSurveyAnswerConnection, {
    description: 'Retrieve doctor patient question answers',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorFindPatientQuestionAnswers(
    @IAM('id') doctorId: string,

    @Args('patientId', { type: () => UUID })
    patientId: string,

    @Args('questionId', { type: () => UUID })
    questionId: string,

    @Args('take', {
      type: () => Int,
      defaultValue: 4,
      nullable: true,
      description: 'less than or equal 20',
    })
    take: number | null,

    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after: string | null,

    @Args('surveyTemplateId', { nullable: true })
    surveyTemplateId: string | null,

    @Args('startAt', { type: () => Date, nullable: true })
    startAt: Date | null,

    @Args('endAt', { type: () => Date, nullable: true })
    endAt: Date | null,
  ) {
    return this.doctorSurveysService.findDoctorPatientQuestionAnswers({
      doctorId,
      patientId,
      questionId,
      take,
      after,
      surveyTemplateId,
      startAt,
      endAt,
    });
  }
}
