import { Field, ObjectType } from '@nestjs/graphql';

import { BasePayload } from '../../common/payloads';
import { NotExistEmailProblem } from '../../common/problems';
import { MeHospitalManagerModel } from '../models/me-hospital-manager.model';

@ObjectType()
export class HospitalManagerEmailSignInPayload implements BasePayload {
  @Field(() => NotExistEmailProblem, { nullable: true })
  problem?: NotExistEmailProblem;

  @Field(() => MeHospitalManagerModel, {
    nullable: true,
  })
  user?: Parameters<typeof MeHospitalManagerModel.create>[0];

  @Field(() => String, {
    nullable: true,
  })
  token?: string;
  @Field(() => String, {
    nullable: true,
  })
  refreshToken?: string;

  static create(props: Partial<HospitalManagerEmailSignInPayload>) {
    const payload = new HospitalManagerEmailSignInPayload();
    const user = MeHospitalManagerModel.create(props.user);
    Object.assign(payload, {
      token: props.token,
      refreshToken: props.refreshToken,
      user,
    });
    return payload;
  }
}
