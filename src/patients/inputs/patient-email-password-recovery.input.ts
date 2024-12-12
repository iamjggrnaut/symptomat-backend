import { Field, InputType, PickType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { UserPasswordInput } from 'src/common/inputs';

@InputType()
export class PatientEmailPasswordRecoveryInput extends PickType(UserPasswordInput, ['password']) {
  @Field(() => String)
  @IsString()
  code: string;

  @Field(() => String)
  @Transform(({ value }) => value.toLowerCase())
  @Length(6, 256)
  email: string;
}
