import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class PatientNotificationsExtraData {
  @Field(() => String)
  surveyId: string;
}

export enum PatientNotificationKind {
  NEW_SURVEY = 'newSurvey',
}

registerEnumType(PatientNotificationKind, {
  name: 'PatientNotificationKind',
});

export class PatientNotificationsSettings {
  newSurvey: boolean;
}
