import { Field, ObjectType } from '@nestjs/graphql';
import { FieldFromResolver } from 'src/common/decorators';
import { SurveyTemplateModel } from 'src/survey-templates/models';

import { Survey } from '../entities';

@ObjectType()
export class SurveyModel {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @FieldFromResolver(() => SurveyTemplateModel)
  template: SurveyTemplateModel;

  protected constructor(data: Partial<Survey>) {
    Object.assign(this, data);
  }

  static create(props: Survey): SurveyModel {
    return new SurveyModel(props);
  }
}
