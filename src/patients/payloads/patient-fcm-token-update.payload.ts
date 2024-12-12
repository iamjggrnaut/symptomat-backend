import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';

import { MePatientModel } from '../models';

@ObjectType()
export class PatientFcmTokenUpdatePayload extends BasePayload {
  @Field(() => MePatientModel, {
    nullable: true,
  })
  user?: Parameters<typeof MePatientModel.create>[0];

  static create(props: Partial<PatientFcmTokenUpdatePayload>) {
    const payload = new PatientFcmTokenUpdatePayload();
    const user = MePatientModel.create(props.user);
    Object.assign(payload, {
      user,
    });
    return payload;
  }
}
