import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class PatientRemoveInput {
  @Field(() => String)
  @IsUUID()
  patientId: string;
}
