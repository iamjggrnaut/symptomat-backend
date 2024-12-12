import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsRepository } from 'src/questions/repositories';

@Injectable()
export class DoctorQuestionOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(QuestionsRepository)
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const id = ctx.getArgs().id;
    const doctor = request.user;

    const question = await this.questionsRepository.findOne({
      where: {
        id,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not exist');
    }

    if (question.doctorId != doctor.id && question.doctorId != null) {
      throw new BadRequestException("Can't get another doctor's question");
    }

    return true;
  }
}
