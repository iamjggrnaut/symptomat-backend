import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { FloatString } from 'src/common/scalars/float-string.scalar';
import { QuestionType } from 'src/questions/questions.types';

@InputType(SurveyTemplateWeightQuestionCriticalIndicators.name + 'Input')
@ObjectType()
export class SurveyTemplateWeightQuestionCriticalIndicators {
  @IsNumber()
  @Field(() => FloatString)
  minValue: number;

  @IsNumber()
  @Field(() => FloatString)
  maxValue: number;
}

@InputType(SurveyTemplatePulseQuestionCriticalIndicators.name + 'Input')
@ObjectType()
@InputType()
export class SurveyTemplatePulseQuestionCriticalIndicators {
  @IsNumber()
  @Field(() => FloatString)
  minValue: number;

  @IsNumber()
  @Field(() => FloatString)
  maxValue: number;
}

@InputType(SurveyTemplateNumericQuestionCriticalIndicators.name + 'Input')
@ObjectType()
export class SurveyTemplateNumericQuestionCriticalIndicators {
  @IsOptional()
  @IsNumber()
  @Field(() => FloatString, { nullable: true })
  minValue?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => FloatString, { nullable: true })
  maxValue?: number;
}

@InputType(SurveyTemplateScaleQuestionCriticalIndicators.name + 'Input')
@ObjectType()
export class SurveyTemplateScaleQuestionCriticalIndicators {
  @IsNumber()
  @Field(() => FloatString)
  value: number;
}

@InputType(SurveyTemplateTemperatureQuestionCriticalIndicators.name + 'Input')
@ObjectType()
export class SurveyTemplateTemperatureQuestionCriticalIndicators {
  @IsNumber()
  @Field(() => FloatString)
  minValue: number;

  @IsNumber()
  @Field(() => FloatString)
  maxValue: number;
}

@InputType(SurveyTemplatePressureQuestionCriticalIndicators.name + 'Input')
@ObjectType()
export class SurveyTemplatePressureQuestionCriticalIndicators {
  @IsNumber()
  @Field(() => FloatString)
  minUpperValue: number;

  @IsNumber()
  @Field(() => FloatString)
  maxUpperValue: number;

  @IsNumber()
  @Field(() => FloatString)
  minLowerValue: number;

  @IsNumber()
  @Field(() => FloatString)
  maxLowerValue: number;
}

@InputType(SurveyTemplateQuestionCriticalIndicators.name + 'Input')
@ObjectType()
export class SurveyTemplateQuestionCriticalIndicators {
  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyTemplateWeightQuestionCriticalIndicators)
  @Field(() => SurveyTemplateWeightQuestionCriticalIndicators, { nullable: true })
  [QuestionType.WEIGHT]?: SurveyTemplateWeightQuestionCriticalIndicators;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyTemplatePulseQuestionCriticalIndicators)
  @Field(() => SurveyTemplatePulseQuestionCriticalIndicators, { nullable: true })
  [QuestionType.PULSE]?: SurveyTemplatePulseQuestionCriticalIndicators;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyTemplateNumericQuestionCriticalIndicators)
  @Field(() => SurveyTemplateNumericQuestionCriticalIndicators, { nullable: true })
  [QuestionType.NUMERIC]?: SurveyTemplateNumericQuestionCriticalIndicators;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyTemplateScaleQuestionCriticalIndicators)
  @Field(() => SurveyTemplateScaleQuestionCriticalIndicators, { nullable: true })
  [QuestionType.SCALE]?: SurveyTemplateScaleQuestionCriticalIndicators;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyTemplateTemperatureQuestionCriticalIndicators)
  @Field(() => SurveyTemplateTemperatureQuestionCriticalIndicators, { nullable: true })
  [QuestionType.TEMPERATURE]?: SurveyTemplateTemperatureQuestionCriticalIndicators;

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyTemplatePressureQuestionCriticalIndicators)
  @Field(() => SurveyTemplatePressureQuestionCriticalIndicators, { nullable: true })
  [QuestionType.PRESSURE]?: SurveyTemplatePressureQuestionCriticalIndicators;
}
