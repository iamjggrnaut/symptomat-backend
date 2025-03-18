import { Base } from 'src/common/entities/base.entity';
import { Language, UsersRole } from 'src/common/types/users.types';
import { DoctorNotificationsSettings } from 'src/doctors/doctors.types';
import { DoctorNotification } from 'src/doctors/entities';
import { HospitalsDoctors } from 'src/hospitals/entities';
import { PatientNotification } from 'src/patients/entities';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

const tableName = 'doctors';

const defaultNotificationsSetting: DoctorNotificationsSettings = {
  uploadAnalyzesByPatients: true,
  criticalIndicators: true,
  contactMeRequest: true,
};

@Unique('DOCTOR_EMAIL_UQ', ['email'])
@Entity({ name: tableName })
export class SymptomatDoctor extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => HospitalsDoctors, (hd) => hd.doctor, { cascade: true })
  hospitalsDoctors: HospitalsDoctors[];

  @Column('enum', { enum: Language, default: Language.RU })
  language: Language;

  @BeforeInsert()
  updateEmail() {
    this.email = this.email.toLowerCase();
  }

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'jsonb', default: defaultNotificationsSetting })
  notificationsSettings: DoctorNotificationsSettings;

  @OneToMany(() => DoctorNotification, (dn) => dn.doctor, { nullable: true })
  notifications?: DoctorNotification;

  @OneToMany(() => PatientNotification, (pn) => pn.doctor, { cascade: true })
  patientNotifications?: PatientNotification;

  @Column({
    type: 'enum',
    enum: UsersRole,
    default: UsersRole.DOCTOR,
  })
  role: UsersRole;
}
