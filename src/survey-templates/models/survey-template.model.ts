import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FieldFromResolver } from 'src/common/decorators';
import { DrugModel } from 'src/drugs/models';

import { SurveyTemplate } from '../entities';
import { SurveyTemplateKind, SurveyTemplatePeriod } from '../survey-templates.types';
import { SurveyTemplateQuestionModel } from './survey-template-question.model';

@ObjectType()
export class SurveyTemplateModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => Date)
  endAt: Date;

  @Field(() => Date)
  startAt: Date;

  @Field(() => SurveyTemplatePeriod)
  period: SurveyTemplatePeriod;

  @Field(() => SurveyTemplateKind)
  kind: SurveyTemplateKind;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Int)
  timezoneOffset: number;

  @FieldFromResolver(() => Int)
  questionsCount: number;

  @FieldFromResolver(() => [DrugModel])
  drugs: DrugModel[];

  @FieldFromResolver(() => [SurveyTemplateQuestionModel])
  questions: SurveyTemplateQuestionModel[];

  protected constructor(data: Partial<SurveyTemplate>) {
    Object.assign(this, data);
  }

  static create(props: SurveyTemplate): SurveyTemplateModel {
    return new SurveyTemplateModel(props);
  }
}
