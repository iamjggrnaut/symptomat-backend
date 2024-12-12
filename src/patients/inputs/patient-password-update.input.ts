import { Field, InputType, PickType } from '@nestjs/graphql';
import { Length } from 'class-validator';

import { PatientCreatePasswordInput } from './patient-create-password.input';

@InputType()
export class PatientPasswordUpdateInput extends PickType(PatientCreatePasswordInput, ['password']) {
  @Length(6, 256)
  @Field(() => String)
  oldPassword: string;
}
