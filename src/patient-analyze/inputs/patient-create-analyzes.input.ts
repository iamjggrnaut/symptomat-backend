import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsString, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/scalars/uuid.scalar';

@InputType()
export class PatientCreateAnalyzesInput {
  @Field(() => String)
  @IsString()
  fileKey: string;

  @Field(() => String)
  @IsString()
  fileName: string;
}

@InputType()
export class CreateAnalyzesInput {
  @Field(() => UUID)
  @IsString()
  doctorId: string;

  @Field(() => [PatientCreateAnalyzesInput])
  @ValidateNested({ each: true })
  @Type(() => PatientCreateAnalyzesInput)
  @ArrayMaxSize(9)
  files: PatientCreateAnalyzesInput[];
}
