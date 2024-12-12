import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';
import { ExistEmailProblem, TooManyRequestsProblem } from 'src/common/problems';

export const PatientEmailUpdateSendCodeProblem = createUnionType({
  name: 'PatientEmailUpdateSendCodeProblemUnion',
  types: () => [ExistEmailProblem, TooManyRequestsProblem],
});

@ObjectType()
export class PatientEmailUpdateSendPasswordPayload extends BasePayload {
  static create(props: Partial<PatientEmailUpdateSendPasswordPayload>) {
    const payload = new PatientEmailUpdateSendPasswordPayload();
    Object.assign(payload, props);
    return payload;
  }

  @Field(() => PatientEmailUpdateSendCodeProblem, { nullable: true })
  problem?: ExistEmailProblem | TooManyRequestsProblem;

  @Field({ nullable: true, description: 'send when DEVELOPMENT environment' })
  password?: string;
}
