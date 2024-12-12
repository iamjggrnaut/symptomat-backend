import { Field, ObjectType } from '@nestjs/graphql';

import { BasePayload } from '../../common/payloads';
import { EmailSignUpSendCodeProblem, ExistEmailProblem, TooManyRequestsProblem } from '../../common/problems';

@ObjectType()
export class PatientEmailPasswordRecoverySendCodePayload implements BasePayload {
  @Field(() => EmailSignUpSendCodeProblem, { nullable: true })
  problem?: ExistEmailProblem | TooManyRequestsProblem;

  @Field(() => String, { nullable: true })
  code?: string;

  static create(props: Partial<PatientEmailPasswordRecoverySendCodePayload>) {
    const payload = new PatientEmailPasswordRecoverySendCodePayload();
    Object.assign(payload, props);
    return payload;
  }
}
