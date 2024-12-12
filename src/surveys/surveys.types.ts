import { registerEnumType } from '@nestjs/graphql';

export enum SurveyStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

registerEnumType(SurveyStatus, {
  name: 'SurveyStatus',
});

export class SurveyAnswerStat {
  questionId: string;
  weightMax: number | null;
  weightMin: number | null;
  pulseMax: number | null;
  pulseMin: number | null;
  numericMax: number | null;
  numericMin: number | null;
  scaleMax: number | null;
  scaleMin: number | null;
  temperatureMax: number | null;
  temperatureMin: number | null;
  pressureUpperMax: number | null;
  pressureUpperMin: number | null;
  pressureLowerMax: number | null;
  pressureLowerMin: number | null;
  answerQuestionOptionMaxIndex: number | null;
  answerQuestionOptionMinIndex: number | null;
}
