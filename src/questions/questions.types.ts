import { registerEnumType } from '@nestjs/graphql';

export enum QuestionType {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  NUMERIC = 'numeric',
  SCALE = 'scale',
  PRESSURE = 'pressure',
  TEMPERATURE = 'temperature',
  WEIGHT = 'weight',
  PULSE = 'pulse',
}

registerEnumType(QuestionType, {
  name: 'QuestionType',
});

export enum QuestionAccessType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

registerEnumType(QuestionAccessType, {
  name: 'QuestionAccessType',
});
