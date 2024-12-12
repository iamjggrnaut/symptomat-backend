import { Field, ObjectType } from '@nestjs/graphql';
import { BaseProblem } from 'src/common/payloads';
import { BasePayload } from 'src/common/payloads/base/base-payload';
import { SurveyTemplateModel } from 'src/survey-templates/models';

@ObjectType()
export class DoctorCreateSurveyTemplatePayload implements BasePayload {
  @Field(() => BaseProblem, { nullable: true })
  problem?: BaseProblem;

  @Field(() => SurveyTemplateModel, { nullable: true })
  surveyTemplate?: SurveyTemplateModel;

  constructor(data: Partial<DoctorCreateSurveyTemplatePayload>) {
    Object.assign(this, data);
  }

  static create(props: Partial<DoctorCreateSurveyTemplatePayload>): DoctorCreateSurveyTemplatePayload {
    return new DoctorCreateSurveyTemplatePayload(props);
  }
}
