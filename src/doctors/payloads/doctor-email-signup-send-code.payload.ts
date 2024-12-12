import { Field, ObjectType } from '@nestjs/graphql';

import { BasePayload } from '../../common/payloads';
import { EmailSignUpSendCodeProblem, ExistEmailProblem, TooManyRequestsProblem } from '../../common/problems';

@ObjectType()
export class DoctorEmailSignUpSendCodePayload implements BasePayload {
  @Field(() => EmailSignUpSendCodeProblem, { nullable: true })
  problem?: ExistEmailProblem | TooManyRequestsProblem;

  @Field(() => String, { nullable: true })
  hash?: string;

  static create(props: Partial<DoctorEmailSignUpSendCodePayload>) {
    const payload = new DoctorEmailSignUpSendCodePayload();
    Object.assign(payload, props);
    return payload;
  }
}
