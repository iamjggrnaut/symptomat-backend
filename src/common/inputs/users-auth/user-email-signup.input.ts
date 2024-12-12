import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class UsersEmailSignUpInput {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Field(() => String)
  email: string;

  @Length(6, 256)
  @Field(() => String)
  password: string;
}
