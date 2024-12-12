import { Field, ObjectType } from '@nestjs/graphql';
import { FieldFromResolver } from 'src/common/decorators';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { QuestionOptionModel } from 'src/questions/models';
import { PrimaryGeneratedColumn } from 'typeorm';

import { SurveyAnswer } from '../entities';
import { SurveyAnswerValue } from '../surveys.answer-value.types';

@ObjectType()
export class SurveyAnswerModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Boolean)
  isCritical: boolean;

  @Field(() => SurveyAnswerValue, { nullable: true })
  answerValue: SurveyAnswerValue | null;

  @Field(() => UUID, { nullable: true })
  answerQuestionOptionId: string | null;

  @Field(() => [UUID], { nullable: true })
  answerQuestionOptionsIds: string[] | null;

  @FieldFromResolver(() => QuestionOptionModel, { nullable: true })
  answerQuestionOption: QuestionOptionModel | null;

  @FieldFromResolver(() => [QuestionOptionModel], { nullable: true })
  answerQuestionOptions: QuestionOptionModel[];

  @Field(() => UUID)
  questionId: string;

  @Field(() => UUID)
  surveyId: string;

  @Field(() => Date)
  createdAt: Date;

  protected constructor(data: SurveyAnswer) {
    Object.assign(this, data);
  }

  static create(props: SurveyAnswer): SurveyAnswerModel {
    return new SurveyAnswerModel(props);
  }
}
