import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsUUID, ValidateIf, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { QuestionType } from 'src/questions/questions.types';
import { SurveyAnswerValue } from 'src/surveys/surveys.answer-value.types';

@InputType()
export class PatientCompleteSurveyAnswerInput {
  @IsUUID()
  @Field(() => UUID)
  questionId: string;

  @IsEnum(QuestionType)
  @Field(() => QuestionType)
  questionType: QuestionType;

  @ValidateIf((input: PatientCompleteSurveyAnswerInput) => {
    const isRadioType = input.questionType === QuestionType.RADIO;
    return isRadioType;
  })
  @IsUUID()
  @Field(() => UUID, {
    nullable: true,
    description: `Pass if question type is ${QuestionType.RADIO}`,
  })
  answerQuestionOptionId: string | null;

  @ValidateIf((input: PatientCompleteSurveyAnswerInput) => {
    const isCheckboxType = input.questionType === QuestionType.CHECKBOX;
    return isCheckboxType;
  })
  @IsUUID('4', { each: true })
  @Field(() => [UUID], {
    nullable: true,
    description: `Pass if question type is ${QuestionType.CHECKBOX}`,
  })
  answerQuestionOptionsIds: string[] | null;

  @ValidateIf((input: PatientCompleteSurveyAnswerInput) => {
    const isCheckboxType = input.questionType === QuestionType.CHECKBOX;
    const isRadioType = input.questionType === QuestionType.RADIO;
    return !isCheckboxType && !isRadioType;
  })
  @ValidateNested()
  @Type(() => SurveyAnswerValue)
  @Field(() => SurveyAnswerValue, {
    nullable: true,
    description: `Pass if question type is not ${QuestionType.CHECKBOX} or ${QuestionType.RADIO}`,
  })
  answerValue: SurveyAnswerValue | null;
}

@InputType()
export class PatientCompleteSurveyInput {
  @Field(() => UUID)
  @IsUUID()
  surveyId: string;

  @ValidateNested({ each: true })
  @Type(() => PatientCompleteSurveyAnswerInput)
  @Field(() => [PatientCompleteSurveyAnswerInput], { nullable: true })
  answers: PatientCompleteSurveyAnswerInput[];
}
