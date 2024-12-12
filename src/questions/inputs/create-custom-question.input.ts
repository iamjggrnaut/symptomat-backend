import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { ScaleQuestionIndicators } from '../questions.indicators.types';
import { QuestionType } from '../questions.types';

@InputType()
export class CreateCustomQuestionInput {
  @IsString()
  @Field(() => String)
  title: string;

  @IsNotEmpty()
  @Field(() => QuestionType)
  type: QuestionType;

  @ValidateIf((input: CreateCustomQuestionInput) => {
    const isCheckboxType = input.type === QuestionType.CHECKBOX;
    const isRadioType = input.type === QuestionType.RADIO;
    return isCheckboxType || isRadioType;
  })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  options?: string[];

  @ValidateIf((input: CreateCustomQuestionInput) => {
    const isScaleType = input.type === QuestionType.SCALE;
    return isScaleType;
  })
  @IsOptional()
  @Type(() => ScaleQuestionIndicators)
  @Field(() => ScaleQuestionIndicators, { nullable: true })
  scaleIndicators?: ScaleQuestionIndicators | null;
}
