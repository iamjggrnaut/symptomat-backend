import crypto from 'crypto';

import { PatientNotification } from 'src/patients/entities/patient-notification.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Language, UsersRole } from '../../common/types/users.types';
import { HospitalsDoctors } from '../../hospitals/entities/hospitals-doctors.entity';
import { DoctorNotificationsSettings } from '../doctors.types';
import { DoctorNotification } from './doctor-notification.entity';

const tableName = 'doctors';

const defaultNotificationsSetting: DoctorNotificationsSettings = {
  uploadAnalyzesByPatients: true,
  criticalIndicators: true,
  contactMeRequest: true,
};

@Unique('DOCTOR_EMAIL_UQ', ['email'])
@Entity({ name: tableName })
export class Doctor extends Base {
  static tableName = tableName;

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

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @BeforeUpdate()
  hashPasswordBeforeUpdate() {
    if (this.password) {
      this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }
  }

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
