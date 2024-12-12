import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { SentryInterceptor } from 'src/common/interceptors';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { QuestionModel } from 'src/questions/models';

import { UsersRole } from '../../common/types/users.types';
import { DrugModel } from '../models';
import { DrugsService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class DrugsQueryResolver {
  constructor(private readonly drugsService: DrugsService) {}

  @Query(() => [DrugModel], {
    description: 'Search drugs',
  })
  @UserRoles(UsersRole.DOCTOR, UsersRole.MANAGER, UsersRole.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async drugsSearch(
    @Args('filter', {
      type: () => String,
      nullable: true,
    })
    filter?: string,
  ) {
    const drugs = await this.drugsService.search(filter);
    return drugs.map(DrugModel.create);
  }

  @Query(() => [QuestionModel], {
    description: 'Find drug questions',
  })
  @UserRoles(UsersRole.DOCTOR, UsersRole.MANAGER, UsersRole.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async drugFindQuestions(
    @Args('id', { type: () => UUID })
    drugId: string,
  ) {
    const questions = await this.drugsService.findDrugQuestions(drugId);
    return questions.map(QuestionModel.create);
  }
}
