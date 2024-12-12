import { Field, ObjectType } from '@nestjs/graphql';
import { pickObject } from 'src/utils/pick-object';

import { PatientNotificationsSettings } from '../patients.types';

@ObjectType()
export class PatientNotificationsSettingsModel {
  private constructor(data: Partial<PatientNotificationsSettings>) {
    Object.assign(this, data);
  }

  static create(props: PatientNotificationsSettings) {
    return new PatientNotificationsSettingsModel({
      ...pickObject(props, ['newSurvey']),
    });
  }

  @Field(() => Boolean, { nullable: true })
  newSurvey: boolean;
}
