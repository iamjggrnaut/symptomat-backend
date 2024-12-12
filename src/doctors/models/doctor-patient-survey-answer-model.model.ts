import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { QuestionType } from 'src/questions/questions.types';
import { SurveyAnswerValue } from 'src/surveys/surveys.answer-value.types';

@ObjectType()
export class DoctorPatientSurveyAnswerModel {
  @Field(() => UUID)
  questionId: string;

  @Field(() => String)
  questionTitle: string;

  @Field(() => QuestionType)
  questionType: QuestionType;

  @Field(() => Boolean)
  isQuestionCustom: boolean;

  @Field(() => String, { nullable: true })
  answerQuestionOptionText: string | null;

  @Field(() => [String], { nullable: true })
  answerQuestionOptionsTexts: string[] | null;

  @Field(() => SurveyAnswerValue, { nullable: true })
  answerValue: SurveyAnswerValue | null;

  @Field(() => String, { nullable: true })
  minAnswer: string | null;

  @Field(() => String, { nullable: true })
  maxAnswer: string | null;

  @Field(() => Boolean)
  isCritical: boolean;

  private constructor(data: DoctorPatientSurveyAnswerModel) {
    Object.assign(this, data);
  }

  static create(props: DoctorPatientSurveyAnswerModel) {
    return new DoctorPatientSurveyAnswerModel(props);
  }
}
