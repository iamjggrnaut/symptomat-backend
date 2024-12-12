import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export class DoctorNotificationsSettings {
  uploadAnalyzesByPatients: boolean;
  criticalIndicators: boolean;
  contactMeRequest: boolean;
}

export enum DoctorNotificationKind {
  UPLOAD_ANALYZES_BY_PATIENT = 'uploadAnalyzesByPatients',
  CRITICAL_INDICATORS = 'criticalIndicators',
  CONTACT_ME_REQUEST = 'contactMeRequest',
}

registerEnumType(DoctorNotificationKind, {
  name: 'DoctorNotificationKind',
});

@ObjectType()
export class DoctorNotificationsExtraData {
  @Field(() => String)
  surveyTemplateId: string;
}
