import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';
import { DrugModel } from 'src/drugs/models';

import {
  SurveyTemplateDrugsLoader,
  SurveyTemplateQuestionsCountLoader,
  SurveyTemplateQuestionsLoader,
} from '../dataloaders';
import { SurveyTemplateQuestion, SurveyTemplatesDrug } from '../entities';
import { SurveyTemplateModel, SurveyTemplateQuestionModel } from '../models';

@Resolver(() => SurveyTemplateModel)
export class SurveyTemplateResolver {
  @ResolveField(() => Int)
  async questionsCount(
    @Parent()
    surveyTemplateModel: SurveyTemplateModel,
    @Loader(SurveyTemplateQuestionsCountLoader.name)
    surveyTemplateQuestionsCountLoader: Dataloader<string, number>,
  ) {
    const questionsCount = await surveyTemplateQuestionsCountLoader.load(surveyTemplateModel.id);
    return questionsCount;
  }

  @ResolveField(() => [DrugModel])
  async drugs(
    @Parent()
    surveyTemplateModel: SurveyTemplateModel,
    @Loader(SurveyTemplateDrugsLoader.name)
    surveyTemplateDrugsLoader: Dataloader<string, SurveyTemplatesDrug[]>,
  ) {
    const surveyTemplateDrugs = await surveyTemplateDrugsLoader.load(surveyTemplateModel.id);
    return surveyTemplateDrugs.map((surveyTemplateDrug) => DrugModel.create(surveyTemplateDrug.drug));
  }

  @ResolveField(() => [SurveyTemplateQuestionModel])
  async questions(
    @Parent()
    surveyTemplateModel: SurveyTemplateModel,
    @Loader(SurveyTemplateQuestionsLoader.name)
    surveyTemplateQuestionsLoader: Dataloader<string, SurveyTemplateQuestion[]>,
  ) {
    const surveyTemplateQuestions = await surveyTemplateQuestionsLoader.load(surveyTemplateModel.id);
    return surveyTemplateQuestions.map((surveyTemplateQuestion) =>
      SurveyTemplateQuestionModel.create(surveyTemplateQuestion),
    );
  }
}
