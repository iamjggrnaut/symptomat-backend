import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { TimezoneOffsetValidator } from 'src/common/validators';
import { QuestionType } from 'src/questions/questions.types';
import { SurveyTemplateQuestionCriticalIndicators } from 'src/survey-templates/survey-templates.question-critical-indicators.types';
import { SurveyTemplatePeriod } from 'src/survey-templates/survey-templates.types';

@InputType()
export class QuestionInput {
  @IsUUID()
  @Field(() => UUID)
  questionId: string;

  @IsEnum(QuestionType)
  @Field(() => QuestionType)
  questionType: QuestionType;

  @ValidateIf((input: QuestionInput) => {
    const isCheckboxType = input.questionType === QuestionType.CHECKBOX;
    const isRadioType = input.questionType === QuestionType.RADIO;
    return !isCheckboxType && !isRadioType;
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyTemplateQuestionCriticalIndicators)
  @Field(() => SurveyTemplateQuestionCriticalIndicators, {
    nullable: true,
    description: `Pass if question type is not ${QuestionType.RADIO} or ${QuestionType.CHECKBOX}`,
  })
  criticalIndicators: SurveyTemplateQuestionCriticalIndicators | null;

  @ValidateIf((input: QuestionInput) => {
    const isRadioType = input.questionType === QuestionType.RADIO;
    return isRadioType;
  })
  @IsOptional()
  @IsUUID()
  @Field(() => UUID, {
    nullable: true,
    description: `Pass if question type is ${QuestionType.RADIO}`,
  })
  criticalAnswerId: string | null;

  @ValidateIf((input: QuestionInput) => {
    const isCheckboxType = input.questionType === QuestionType.CHECKBOX;
    return isCheckboxType;
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  @Field(() => [UUID], {
    nullable: true,
    description: `Pass if question type is ${QuestionType.CHECKBOX}`,
  })
  criticalAnswersIds: string[] | null;
}

@InputType()
export class DoctorCreateSurveyTemplateInput {
  @IsUUID()
  @Field(() => UUID)
  patientId: string;

  @IsString()
  @Field(() => String)
  title: string;

  @IsEnum(SurveyTemplatePeriod)
  @Field(() => SurveyTemplatePeriod)
  period: SurveyTemplatePeriod;

  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  @Field(() => Date)
  startAt: Date;

  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  @Field(() => Date)
  endAt: Date;

  @IsUUID('4', { each: true })
  @Field(() => [UUID])
  drugsIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionInput)
  @Field(() => [QuestionInput])
  questions: QuestionInput[];

  @IsInt()
  @Validate(TimezoneOffsetValidator)
  @Field(() => Int, { defaultValue: 0, nullable: true })
  timezoneOffset?: number;
}
