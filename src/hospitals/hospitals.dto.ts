import { IsDefined, IsNumber, IsString, Min } from 'class-validator';

export class CreateHospitalDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsNumber()
  @Min(0)
  patientsLimit: number;
}
