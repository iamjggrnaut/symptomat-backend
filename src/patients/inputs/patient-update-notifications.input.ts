import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class PatientUpdateNotificationsInput {
  @IsNotEmpty()
  @Field(() => Boolean)
  newSurveyNotifications: boolean;
}
