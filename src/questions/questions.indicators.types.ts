import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FloatString } from 'src/common/scalars/float-string.scalar';

import { QuestionType } from './questions.types';

@InputType(NumericQuestionIndicators.name + 'Input')
@ObjectType()
export class NumericQuestionIndicators {
  @Field(() => FloatString)
  minValue: number;

  @Field(() => FloatString)
  maxValue: number;
}

@InputType(ScaleQuestionIndicators.name + 'Input')
@ObjectType()
export class ScaleQuestionIndicators {
  @Field(() => FloatString)
  minValue: number;

  @Field(() => FloatString)
  maxValue: number;
}

@InputType(TemperatureQuestionIndicators.name + 'Input')
@ObjectType()
export class TemperatureQuestionIndicators {
  @Field(() => FloatString)
  minValue: number;

  @Field(() => FloatString)
  maxValue: number;
}

@InputType(PressureQuestionIndicators.name + 'Input')
@ObjectType()
export class PressureQuestionIndicators {
  @Field(() => FloatString)
  upperMinValue: number;

  @Field(() => FloatString)
  upperMaxValue: number;

  @Field(() => FloatString)
  lowerMinValue: number;

  @Field(() => FloatString)
  lowerMaxValue: number;
}

@InputType(QuestionIndicators.name + 'Input')
@ObjectType()
export class QuestionIndicators {
  @Field(() => NumericQuestionIndicators, { nullable: true })
  [QuestionType.NUMERIC]?: NumericQuestionIndicators;

  @Field(() => ScaleQuestionIndicators, { nullable: true })
  [QuestionType.SCALE]?: ScaleQuestionIndicators;

  @Field(() => TemperatureQuestionIndicators, { nullable: true })
  [QuestionType.TEMPERATURE]?: TemperatureQuestionIndicators;

  @Field(() => PressureQuestionIndicators, { nullable: true })
  [QuestionType.PRESSURE]?: PressureQuestionIndicators;
}
