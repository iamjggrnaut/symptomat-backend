import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { BasePayload } from 'src/common/payloads/base/base-payload';
import { Doctor } from 'src/doctors/entities';

import { UsersRole } from '../../common/types/users.types';
import { CreateCustomQuestionInput } from '../inputs/create-custom-question.input';
import { CreateCustomQuestionPayload } from '../payloads/create-custom-question.payload';
import { QuestionsService } from '../services/questions.service';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class QuestionMutationResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Mutation(() => CreateCustomQuestionPayload, {
    description: 'Create custom question',
  })
  doctorCreateCustomQuestion(
    @Args({ name: 'input', type: () => CreateCustomQuestionInput })
    input: CreateCustomQuestionInput,
    @IAM()
    doctor: Doctor,
  ) {
    return BasePayload.catchProblems(CreateCustomQuestionPayload, async () => {
      return CreateCustomQuestionPayload.create({
        question: await this.questionsService.createCustomQuestion(doctor.id, input),
      });
    });
  }
}
