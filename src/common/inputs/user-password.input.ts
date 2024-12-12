import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class UserPasswordInput {
  @Length(6, 256)
  @Field(() => String)
  password: string;
}
