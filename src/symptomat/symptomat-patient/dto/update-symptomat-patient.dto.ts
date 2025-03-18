import { Language, UsersRole } from 'src/common/types/users.types';
import { AuthProvider } from 'src/patients/entities/patient.entity';
import { PatientNotificationsSettings } from 'src/patients/patients.types';

export class UpdateSymptomatPatientDto {
  email?: string;
  password?: string;
  fcmToken?: string;
  lastAuthProvider?: AuthProvider;
  notificationsSettings?: PatientNotificationsSettings;
  language?: Language;
  inviteEndAt?: Date;
  isFirstSignUp?: boolean;
  role?: UsersRole;
}
