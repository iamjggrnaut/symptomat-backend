import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-dataloader';
import { QuestionOption } from 'src/questions/entities';
import { QuestionOptionModel } from 'src/questions/models';

import { SurveyAnswerQuestionOptionLoader, SurveyAnswerQuestionOptionsLoader } from '../dataloaders';
import { SurveyAnswerModel } from '../models';

@Resolver(() => SurveyAnswerModel)
export class SurveyAnswerResolver {
  @ResolveField(() => QuestionOptionModel)
  async answerQuestionOption(
    @Parent()
    surveyAnswerModel: SurveyAnswerModel,
    @Loader(SurveyAnswerQuestionOptionLoader.name)
    surveyAnswerQuestionOptionLoader: DataLoader<string, QuestionOption>,
  ) {
    const questionOption = await surveyAnswerQuestionOptionLoader.load(surveyAnswerModel.id);
    if (!questionOption) {
      return null;
    }
    return QuestionOptionModel.create(questionOption);
  }

  @ResolveField(() => [QuestionOptionModel])
  async answerQuestionOptions(
    @Parent()
    surveyAnswerModel: SurveyAnswerModel,
    @Loader(SurveyAnswerQuestionOptionsLoader.name)
    surveyAnswerQuestionOptionsLoader: DataLoader<string, QuestionOption[]>,
  ) {
    const questionOptions = await surveyAnswerQuestionOptionsLoader.load(surveyAnswerModel.id);
    if (!questionOptions) {
      return null;
    }
    return questionOptions.map(QuestionOptionModel.create);
  }
}
