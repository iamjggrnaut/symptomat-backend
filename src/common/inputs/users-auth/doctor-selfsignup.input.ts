import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';

@InputType()
export class DoctorSignUpInput {
  @Transform(({ value }) => value.toLowerCase())
  @Field(() => String, { description: 'Email of the doctor' })
  email: string;

  @Field(() => String, { description: 'Password of the doctor' })
  password: string;
}
