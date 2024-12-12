import { registerEnumType } from '@nestjs/graphql';

export enum SurveyTemplatePeriod {
  EVERYDAY = 'everyday',
  EVERY_TWO_DAYS = 'everyTwoDays',
  ONCE_A_WEEK = 'onceAWeek',
  ONCE_IN_TWO_WEEKS = 'onceInTwoWeeks',
}

registerEnumType(SurveyTemplatePeriod, {
  name: 'SurveyTemplatePeriod',
});

export enum SurveyTemplateKind {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

registerEnumType(SurveyTemplateKind, {
  name: 'SurveyTemplateKind',
});

export enum SurveyTemplateStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
}

registerEnumType(SurveyTemplateStatus, {
  name: 'SurveyTemplateStatus',
});
