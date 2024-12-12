import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DoctorUpdateNotificationsInput {
  @IsNotEmpty()
  @Field(() => Boolean)
  contactMeRequestNotifications: boolean;

  @IsNotEmpty()
  @Field(() => Boolean)
  uploadAnalyzesByPatientsNotifications: boolean;

  @IsNotEmpty()
  @Field(() => Boolean)
  criticalIndicatorsNotifications: boolean;
}
