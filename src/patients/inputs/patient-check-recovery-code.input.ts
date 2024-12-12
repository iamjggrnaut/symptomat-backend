import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

@InputType()
export class PatientCheckRecoveryCodeInput {
  @Field(() => String)
  @IsString()
  code: string;

  @Field(() => String)
  @Transform(({ value }) => value.toLowerCase())
  @Length(6, 256)
  email: string;
}
