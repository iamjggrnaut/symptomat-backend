import { Field, ObjectType } from '@nestjs/graphql';
import { FieldFromResolver } from 'src/common/decorators';

import { Question } from '../entities';
import { QuestionIndicators } from '../questions.indicators.types';
import { QuestionType } from '../questions.types';
import { QuestionOptionModel } from './question-option.model';

@ObjectType()
export class QuestionModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => QuestionType)
  type: QuestionType;

  @Field(() => QuestionIndicators, { nullable: true })
  indicators: QuestionIndicators | null;

  @Field(() => Boolean)
  isCustom: boolean;

  @Field(() => Boolean)
  isActual: boolean;

  @FieldFromResolver(() => [QuestionOptionModel], { nullable: true })
  options: QuestionOptionModel[];

  protected constructor(data: Partial<Question>) {
    Object.assign(this, data);
  }

  static create(props: Question): QuestionModel {
    return new QuestionModel(props);
  }
}
