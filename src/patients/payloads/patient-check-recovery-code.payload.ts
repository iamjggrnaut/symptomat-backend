import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads';
import { NotExistPatientProblem } from 'src/common/problems';

@ObjectType()
export class PatientCheckRecoveryCodePayload implements BasePayload {
  @Field(() => NotExistPatientProblem, { nullable: true })
  problem?: NotExistPatientProblem;

  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  static create(props: Partial<PatientCheckRecoveryCodePayload>) {
    const payload = new PatientCheckRecoveryCodePayload();
    Object.assign(payload, props);
    return payload;
  }
}
