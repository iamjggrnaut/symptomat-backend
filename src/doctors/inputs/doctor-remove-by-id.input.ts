import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DoctorRemoveByIdInput {
  @Field(() => String)
  @IsUUID()
  doctorId: string;
}
