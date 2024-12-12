import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

//import { IsUniqueHospitalPatientEmail } from '../validators';

@InputType()
export class PatientCreateInput {
  @IsEmail()
  //@IsUniqueHospitalPatientEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Field(() => String)
  email: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  firstname: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  lastname: string;

  @Length(1, 50)
  @Field(() => String)
  medicalCardNumber: string;
}
