import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CODE_LENGTH } from 'src/common/types/notification.types';

import { UserEmailUpdateInput } from '../../common/inputs';

@InputType()
export class DoctorEmailUpdateInput extends UserEmailUpdateInput {
  @Field(() => String)
  @Length(CODE_LENGTH, CODE_LENGTH)
  hash: string;
}
