import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';

import { NotExistEmailProblem } from '../../common/problems';
import { MePatientModel } from '../models/me-patient.model';

@ObjectType()
export class PatientEmailSignInPayload implements BasePayload {
  @Field(() => NotExistEmailProblem, { nullable: true })
  problem?: NotExistEmailProblem;

  @Field(() => MePatientModel, {
    nullable: true,
  })
  user?: Parameters<typeof MePatientModel.create>[0];

  @Field(() => String, {
    nullable: true,
  })
  token?: string;
  @Field(() => String, {
    nullable: true,
  })
  refreshToken?: string;

  static create(props: Partial<PatientEmailSignInPayload>) {
    const payload = new PatientEmailSignInPayload();
    const user = MePatientModel.create(props.user);
    Object.assign(payload, {
      token: props.token,
      refreshToken: props.refreshToken,
      user,
    });
    return payload;
  }
}
