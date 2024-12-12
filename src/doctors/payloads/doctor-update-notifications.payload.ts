import { Field, ObjectType } from '@nestjs/graphql';

import { DoctorModel } from '../models/doctor.model';

@ObjectType()
export class DoctorUpdateNotificationsPayload {
  @Field(() => DoctorModel, {
    nullable: true,
  })
  user: DoctorModel;

  static create(props: Partial<DoctorUpdateNotificationsPayload>) {
    const payload = new DoctorUpdateNotificationsPayload();
    Object.assign(payload, props);
    return payload;
  }
}
