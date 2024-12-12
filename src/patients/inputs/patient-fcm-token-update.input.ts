import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class PatientFcmTokenUpdateInput {
  @IsString()
  @Field(() => String)
  fcmToken: string;
}
