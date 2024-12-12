import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';

import { InvalidVerificationEmailPasswordProblem } from '../../common/problems';
import { MePatientModel } from '../models';

@ObjectType()
export class PatientEmailUpdatePayload extends BasePayload {
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

  static create(props: Partial<PatientEmailUpdatePayload>) {
    const payload = new PatientEmailUpdatePayload();
    const user = MePatientModel.create(props.user);
    Object.assign(payload, {
      token: props.token,
      refreshToken: props.refreshToken,
      user,
    });
    return payload;
  }
}
