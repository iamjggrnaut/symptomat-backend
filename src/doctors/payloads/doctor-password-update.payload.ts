import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';

import { PasswordsNotMatchProblem } from '../../common/problems';

@ObjectType()
export class DoctorPasswordUpdatePayload implements BasePayload {
  @Field(() => PasswordsNotMatchProblem, { nullable: true })
  problem?: PasswordsNotMatchProblem;

  @Field(() => String, {
    nullable: true,
  })
  token?: string;
  @Field(() => String, {
    nullable: true,
  })
  refreshToken?: string;

  static create(props: Partial<DoctorPasswordUpdatePayload>) {
    const payload = new DoctorPasswordUpdatePayload();
    Object.assign(payload, {
      token: props.token,
      refreshToken: props.refreshToken,
    });
    return payload;
  }
}
