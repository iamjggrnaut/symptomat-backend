import { Base } from 'src/common/entities/base.entity';
import { UsersRole } from 'src/common/types';
import { Language } from 'src/common/types/users.types';
import { DoctorNotification } from 'src/doctors/entities';
import { PatientAnalyzes } from 'src/patient-analyze/entities/patient-analyzes.entity';
import { PatientNotification } from 'src/patients/entities';
import { AuthProvider } from 'src/patients/entities/patient.entity';
import { PatientNotificationsSettings } from 'src/patients/patients.types';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

const defaultNotificationsSetting: PatientNotificationsSettings = {
  newSurvey: true,
};

const tableName = 'patients';

@Entity({ name: tableName })
export class SymptomatPatient extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UsersRole,
    default: UsersRole.PATIENT,
  })
  role: UsersRole;

  @Column({ type: 'boolean', default: true })
  isFirstSignUp: boolean;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', select: false, nullable: true })
  password?: string;

  @Column({ type: 'text', nullable: true })
  fcmToken?: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.EMAIL })
  lastAuthProvider: AuthProvider;

  @Column({ type: 'jsonb', default: defaultNotificationsSetting })
  notificationsSettings: PatientNotificationsSettings;

  @Column('enum', { enum: Language, default: Language.RU })
  language: Language;

  @Column({ type: 'timestamptz', nullable: true })
  inviteEndAt: Date;

  @OneToMany(() => PatientNotification, (pn) => pn.patient, { cascade: true })
  notifications?: PatientNotification;

  @OneToMany(() => DoctorNotification, (dn) => dn.patient, { cascade: true })
  doctorNotifications?: PatientNotification;

  @OneToMany(() => PatientAnalyzes, (pa) => pa.patient, { cascade: true })
  analyzes: PatientAnalyzes;
}
