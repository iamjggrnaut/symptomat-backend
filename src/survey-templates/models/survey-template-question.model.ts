import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { QuestionModel } from 'src/questions/models';
import { DeepPartial } from 'typeorm';

import { SurveyTemplateQuestion } from '../entities';
import { SurveyTemplateQuestionCriticalIndicators } from '../survey-templates.question-critical-indicators.types';

@ObjectType()
export class SurveyTemplateQuestionModel {
  @Field(() => SurveyTemplateQuestionCriticalIndicators, { nullable: true })
  criticalIndicators: SurveyTemplateQuestionCriticalIndicators | null;

  @Field(() => UUID, { nullable: true })
  criticalAnswerId: string | null;

  @Field(() => [UUID], { nullable: true })
  criticalAnswersIds: string[] | null;

  @Field(() => QuestionModel, { nullable: true })
  question: QuestionModel | null;

  protected constructor(data: DeepPartial<SurveyTemplateQuestion>) {
    Object.assign(this, data);
  }

  static create({ question, ...props }: SurveyTemplateQuestion): SurveyTemplateQuestionModel {
    return new SurveyTemplateQuestionModel({
      ...props,
      question: question ? QuestionModel.create(question) : null,
    });
  }
}
