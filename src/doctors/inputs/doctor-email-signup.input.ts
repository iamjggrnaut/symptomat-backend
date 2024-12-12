import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UserPasswordInput } from 'src/common/inputs';

@InputType()
export class DoctorEmailSignUpInput extends PickType(UserPasswordInput, ['password']) {
  @Field(() => String)
  @IsString()
  hash: string;
}
