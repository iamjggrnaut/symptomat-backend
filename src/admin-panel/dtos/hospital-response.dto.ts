import { Hospital } from 'src/hospitals/entities';

export class HospitalResponseDto extends Hospital {
  patientsCount: number;

  invitationPatientsCount: number;
}
