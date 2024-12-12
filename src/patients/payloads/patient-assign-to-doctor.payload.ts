import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads';
import { NotExistPatientProblem } from 'src/common/problems';

@ObjectType()
export class PatientAssignToDoctorPayload implements BasePayload {
  @Field(() => NotExistPatientProblem, { nullable: true })
  problem?: NotExistPatientProblem;

  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  static create(props: Partial<PatientAssignToDoctorPayload>) {
    const payload = new PatientAssignToDoctorPayload();
    Object.assign(payload, props);
    return payload;
  }
}
