import { DoctorInvitation } from '../entities';

export class CreateDoctorInvitationDto {
  email: DoctorInvitation['email'];
  hospitalId: DoctorInvitation['hospitalId'];
}
