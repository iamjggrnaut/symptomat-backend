import { Field, ObjectType } from '@nestjs/graphql';

import { BasePayload } from '../../common/payloads';
import { NotExistEmailProblem } from '../../common/problems';
import { DoctorModel } from '../models/doctor.model';

@ObjectType()
export class DoctorEmailSignInPayload implements BasePayload {
  @Field(() => NotExistEmailProblem, { nullable: true })
  problem?: NotExistEmailProblem;

  @Field(() => DoctorModel, {
    nullable: true,
  })
  user?: Parameters<typeof DoctorModel.create>[0];

  @Field(() => String, {
    nullable: true,
  })
  token?: string;
  @Field(() => String, {
    nullable: true,
  })
  refreshToken?: string;

  static create(props: Partial<DoctorEmailSignInPayload>) {
    const payload = new DoctorEmailSignInPayload();
    const user = DoctorModel.create(props.user);
    Object.assign(payload, {
      token: props.token,
      refreshToken: props.refreshToken,
      user,
    });
    return payload;
  }
}
