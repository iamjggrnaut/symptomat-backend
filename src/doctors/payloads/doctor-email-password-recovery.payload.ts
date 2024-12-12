import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads';
import { NotExistDoctorProblem } from 'src/common/problems';

@ObjectType()
export class DoctorEmailPasswordRecoveryPayload implements BasePayload {
  @Field(() => NotExistDoctorProblem, { nullable: true })
  problem?: NotExistDoctorProblem;

  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  static create(props: Partial<DoctorEmailPasswordRecoveryPayload>) {
    const payload = new DoctorEmailPasswordRecoveryPayload();
    Object.assign(payload, props);
    return payload;
  }
}
