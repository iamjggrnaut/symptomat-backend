import { Field, ObjectType } from '@nestjs/graphql';
import { pickObject } from 'src/utils/pick-object';

import { DoctorNotificationsSettings } from '../doctors.types';

@ObjectType()
export class DoctorNotificationSettingsModel {
  private constructor(data: Partial<DoctorNotificationsSettings>) {
    Object.assign(this, data);
  }

  static create(props: DoctorNotificationsSettings) {
    return new DoctorNotificationSettingsModel({
      ...pickObject(props, ['contactMeRequest', 'criticalIndicators', 'uploadAnalyzesByPatients']),
    });
  }

  @Field(() => Boolean, { nullable: true })
  contactMeRequest: boolean;

  @Field(() => Boolean, { nullable: true })
  criticalIndicators: boolean;

  @Field(() => Boolean, { nullable: true })
  uploadAnalyzesByPatients: boolean;
}
