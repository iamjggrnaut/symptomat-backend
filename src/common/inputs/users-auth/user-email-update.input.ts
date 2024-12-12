import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

@InputType()
export class UserEmailUpdateInput {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  @Field(() => String)
  email: string;
}
