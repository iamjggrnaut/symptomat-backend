import { Field, ObjectType } from '@nestjs/graphql';

import { DoctorModel } from '../models/doctor.model';

@ObjectType()
export class DoctorUpdateLanguagePayload {
  @Field(() => DoctorModel, {
    nullable: true,
  })
  user: Parameters<typeof DoctorModel.create>[0];

  static create(props: Partial<DoctorUpdateLanguagePayload>) {
    const payload = new DoctorUpdateLanguagePayload();
    Object.assign(payload, props);
    return payload;
  }
}
