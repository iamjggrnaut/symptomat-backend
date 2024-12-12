import { Field, ObjectType } from '@nestjs/graphql';

import { BasePayload } from '../../common/payloads';
import { EmailSignUpSendCodeProblem, ExistEmailProblem, TooManyRequestsProblem } from '../../common/problems';

@ObjectType()
export class DoctorEmailPasswordRecoverySendLinkPayload implements BasePayload {
  @Field(() => EmailSignUpSendCodeProblem, { nullable: true })
  problem?: ExistEmailProblem | TooManyRequestsProblem;

  @Field(() => String, { nullable: true })
  hash?: string;

  static create(props: Partial<DoctorEmailPasswordRecoverySendLinkPayload>) {
    const payload = new DoctorEmailPasswordRecoverySendLinkPayload();
    Object.assign(payload, props);
    return payload;
  }
}
