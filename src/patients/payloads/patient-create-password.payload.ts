import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';

import { InvalidVerificationEmailPasswordProblem } from '../../common/problems';
import { MePatientModel } from '../models';

@ObjectType()
export class PatientCreatePasswordPayload implements BasePayload {
  @Field(() => InvalidVerificationEmailPasswordProblem, { nullable: true })
  problem?: InvalidVerificationEmailPasswordProblem;

  @Field(() => MePatientModel, {
    nullable: true,
  })
  user?: Parameters<typeof MePatientModel.create>[0];

  @Field(() => String, {
    nullable: true,
  })
  token?: string;
  @Field(() => String, {
    nullable: true,
  })
  refreshToken?: string;

  static create(props: Partial<PatientCreatePasswordPayload>) {
    const payload = new PatientCreatePasswordPayload();
    Object.assign(payload, props);
    return payload;
  }
}
