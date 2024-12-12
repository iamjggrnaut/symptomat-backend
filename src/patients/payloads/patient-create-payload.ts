import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';

import { EmailSignUpSendCodeProblem, ExistEmailProblem, TooManyRequestsProblem } from '../../common/problems';

@ObjectType()
export class PatientCreatePayload implements BasePayload {
  @Field(() => EmailSignUpSendCodeProblem, { nullable: true })
  problem?: ExistEmailProblem | TooManyRequestsProblem;

  @Field(() => String, { nullable: true })
  password?: string;

  static create(props: Partial<PatientCreatePayload>) {
    const payload = new PatientCreatePayload();
    Object.assign(payload, props);
    return payload;
  }
}
