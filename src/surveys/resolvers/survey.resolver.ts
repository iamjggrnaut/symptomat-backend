import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import Dataloader from 'dataloader';
import { Loader } from 'nestjs-dataloader';
import { SurveyTemplate } from 'src/survey-templates/entities';
import { SurveyTemplateModel } from 'src/survey-templates/models';

import { SurveySurveyTemplateLoader } from '../dataloaders';
import { SurveyModel } from '../models';

@Resolver(() => SurveyModel)
export class SurveyResolver {
  @ResolveField(() => [SurveyTemplateModel])
  async template(
    @Parent()
    surveyModel: SurveyModel,
    @Loader(SurveySurveyTemplateLoader.name)
    surveyTemplateQuestionsLoader: Dataloader<string, SurveyTemplate>,
  ) {
    const surveyTemplate = await surveyTemplateQuestionsLoader.load(surveyModel.id);
    return SurveyTemplateModel.create(surveyTemplate);
  }
}
