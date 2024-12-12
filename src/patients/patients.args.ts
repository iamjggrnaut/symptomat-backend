import { ArgsType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { UUID } from 'src/common/scalars/uuid.scalar';

@ArgsType()
export class EmailArgs {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Field()
  email: string;
}

@ArgsType()
export class MedicalCardNumberArgs {
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @Field()
  medicalCardNumber: string;

  @IsUUID()
  @Field(() => UUID)
  hospitalId: string;
}
