import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import { QuestionOptionsLoader } from '../dataloaders';
import { QuestionOption } from '../entities';
import { QuestionModel, QuestionOptionModel } from '../models';

@Resolver(() => QuestionModel)
export class QuestionResolver {
  @ResolveField()
  async options(
    @Parent() questionModel: QuestionModel,
    @Loader(QuestionOptionsLoader.name) questionOptionsLoader: Dataloader<string, QuestionOption[] | null>,
  ): Promise<QuestionOptionModel[] | null> {
    const questionOptions = await questionOptionsLoader.load(questionModel.id);
    if (!questionOptions) {
      return null;
    }
    return questionOptions.map((questionOption) => QuestionOptionModel.create(questionOption));
  }
}
