import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

@InputType()
export class UserEmailSignUpSendCodeInput {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Field(() => String)
  email: string;
}
