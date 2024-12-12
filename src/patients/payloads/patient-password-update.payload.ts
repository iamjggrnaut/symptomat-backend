import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';

import { PasswordsNotMatchProblem } from '../../common/problems';
import { MePatientModel } from '../models';

@ObjectType()
export class PatientPasswordUpdatePayload implements BasePayload {
  @Field(() => PasswordsNotMatchProblem, { nullable: true })
  problem?: PasswordsNotMatchProblem;

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

  static create(props: Partial<PatientPasswordUpdatePayload>) {
    const payload = new PatientPasswordUpdatePayload();
    const user = MePatientModel.create(props.user);
    Object.assign(payload, {
      token: props.token,
      refreshToken: props.refreshToken,
      user,
    });
    return payload;
  }
}
