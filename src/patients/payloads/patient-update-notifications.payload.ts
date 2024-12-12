import { Field, ObjectType } from '@nestjs/graphql';

import { PatientModel } from '../models';

@ObjectType()
export class PatientUpdateNotificationsPayload {
  @Field(() => PatientModel, {
    nullable: true,
  })
  user: PatientModel;

  static create(props: Partial<PatientUpdateNotificationsPayload>) {
    const payload = new PatientUpdateNotificationsPayload();
    Object.assign(payload, props);
    return payload;
  }
}
