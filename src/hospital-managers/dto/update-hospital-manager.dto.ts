import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class UpdateHospitalManagerDto {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  @IsOptional()
  hospitalId: string;
}
