import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class DoctorPasswordUpdateInput {
  @Field(() => String)
  @IsString()
  password: string;

  @Field(() => String)
  @Length(6, 256)
  newPassword: string;
}
