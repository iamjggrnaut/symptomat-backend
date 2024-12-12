import { Field, ObjectType } from '@nestjs/graphql';

import { PatientModel } from '../models';

@ObjectType()
export class PatientUpdateLanguagePayload {
  @Field(() => PatientModel, {
    nullable: true,
  })
  user: Parameters<typeof PatientModel.create>[0];

  static create(props: Partial<PatientUpdateLanguagePayload>) {
    const payload = new PatientUpdateLanguagePayload();
    Object.assign(payload, props);
    return payload;
  }
}
