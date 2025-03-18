import { Language } from 'src/common/types/users.types';
import { DoctorNotificationsSettings } from 'src/doctors/doctors.types';

export class CreateSymptomatDoctorDto {
  email: string;
  password: string;
  language: Language;
  notificationsSettings?: DoctorNotificationsSettings;
}
