import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads';
import { NotExistDoctorProblem } from 'src/common/problems';

@ObjectType()
export class DoctorRemoveByIdPayload implements BasePayload {
  @Field(() => NotExistDoctorProblem, { nullable: true })
  problem?: NotExistDoctorProblem;

  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  static create(props: Partial<DoctorRemoveByIdPayload>) {
    const payload = new DoctorRemoveByIdPayload();
    Object.assign(payload, props);
    return payload;
  }
}
