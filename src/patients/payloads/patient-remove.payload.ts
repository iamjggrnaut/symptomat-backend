import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads';
import { NotExistPatientProblem } from 'src/common/problems';

@ObjectType()
export class PatientRemovePayload implements BasePayload {
  @Field(() => NotExistPatientProblem, { nullable: true })
  problem?: NotExistPatientProblem;

  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  static create(props: Partial<PatientRemovePayload>) {
    const payload = new PatientRemovePayload();
    Object.assign(payload, props);
    return payload;
  }
}
