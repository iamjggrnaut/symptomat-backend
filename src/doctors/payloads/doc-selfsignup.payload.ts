import { Field, ObjectType } from '@nestjs/graphql';

import { Doctor } from '../entities';

@ObjectType()
export class DoctorSignUpPayload {
  @Field(() => Doctor, { nullable: true, description: 'The created doctor' })
  user?: Doctor;

  @Field(() => String, { nullable: true, description: 'JWT token for authentication' })
  token?: string;

  @Field(() => String, { nullable: true, description: 'Refresh token for authentication' })
  refreshToken?: string;
}
