import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { QuestionType } from 'src/questions/questions.types';

@InputType(SurveyWeightAnswerValue.name + 'Input')
@ObjectType()
export class SurveyWeightAnswerValue {
  @IsNumber()
  @Field(() => Float)
  value: number;
}

@InputType(SurveyPulseAnswerValue.name + 'Input')
@ObjectType()
export class SurveyPulseAnswerValue {
  @IsNumber()
  @Field(() => Float)
  value: number;
}

@InputType(SurveyNumericAnswerValue.name + 'Input')
@ObjectType()
export class SurveyNumericAnswerValue {
  @IsNumber()
  @Field(() => Float)
  value: number;
}

@InputType(SurveyScaleAnswerValue.name + 'Input')
@ObjectType()
export class SurveyScaleAnswerValue {
  @IsNumber()
  @Field(() => Float)
  value: number;
}

@InputType(SurveyTemperatureAnswerValue.name + 'Input')
@ObjectType()
export class SurveyTemperatureAnswerValue {
  @IsNumber()
  @Field(() => Float)
  value: number;
}

@InputType(SurveyPressureAnswerValue.name + 'Input')
@ObjectType()
export class SurveyPressureAnswerValue {
  @IsNumber()
  @Field(() => Float)
  upperValue: number;

  @IsNumber()
  @Field(() => Float)
  lowerValue: number;
}

@InputType(SurveyAnswerValue.name + 'Input')
@ObjectType()
export class SurveyAnswerValue {
  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyWeightAnswerValue)
  @Field(() => SurveyWeightAnswerValue, { nullable: true })
  [QuestionType.WEIGHT]?: SurveyWeightAnswerValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyPulseAnswerValue)
  @Field(() => SurveyPulseAnswerValue, { nullable: true })
  [QuestionType.PULSE]?: SurveyPulseAnswerValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyNumericAnswerValue)
  @Field(() => SurveyNumericAnswerValue, { nullable: true })
  [QuestionType.NUMERIC]?: SurveyNumericAnswerValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyScaleAnswerValue)
  @Field(() => SurveyScaleAnswerValue, { nullable: true })
  [QuestionType.SCALE]?: SurveyScaleAnswerValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyTemperatureAnswerValue)
  @Field(() => SurveyTemperatureAnswerValue, { nullable: true })
  [QuestionType.TEMPERATURE]?: SurveyTemperatureAnswerValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyPressureAnswerValue)
  @Field(() => SurveyPressureAnswerValue, { nullable: true })
  [QuestionType.PRESSURE]?: SurveyPressureAnswerValue;
}
