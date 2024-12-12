import { Field, ObjectType } from '@nestjs/graphql';

import { BasePayload } from '../../common/payloads';
import { InvalidVerificationEmailHashProblem } from '../../common/problems';
import { DoctorModel } from '../models/doctor.model';

@ObjectType()
export class DoctorEmailSignUpPayload implements BasePayload {
  @Field(() => InvalidVerificationEmailHashProblem, { nullable: true })
  problem?: InvalidVerificationEmailHashProblem;

  @Field(() => DoctorModel, {
    nullable: true,
  })
  user?: Parameters<typeof DoctorModel.create>[0];

  @Field(() => String, {
    nullable: true,
  })
  token?: string;
  @Field(() => String, {
    nullable: true,
  })
  refreshToken?: string;

  static create(props: Partial<DoctorEmailSignUpPayload>) {
    const payload = new DoctorEmailSignUpPayload();
    Object.assign(payload, props);
    return payload;
  }
}
