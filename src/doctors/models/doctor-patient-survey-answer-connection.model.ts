import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';
import { SurveyAnswerModel } from 'src/surveys/models/survey-answer.model';

@ObjectType()
export class DoctorPatientSurveyAnswerConnection {
  @Field(() => [SurveyAnswerModel])
  nodes: Partial<SurveyAnswerModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
