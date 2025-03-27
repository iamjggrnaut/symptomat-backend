import crypto from 'crypto';

import { Base } from 'src/common/entities/base.entity';
import { DoctorNotification } from 'src/doctors/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Language, UsersRole } from '../../common/types/users.types';
import { PatientAnalyzes } from '../../patient-analyze/entities/patient-analyzes.entity';
import { PatientNotificationsSettings } from '../patients.types';
import { PatientNotification } from './patient-notification.entity';

export enum AuthProvider {
  EMAIL = 'email',
}

const tableName = 'patients';

const defaultNotificationsSetting: PatientNotificationsSettings = {
  newSurvey: true,
};

@Entity({
  name: tableName,
})
export class Patient extends Base {
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

  @BeforeInsert()
  updateEmail() {
    this.email = this.email ? this.email.toLowerCase() : null;
  }

  @Column({ type: 'text', nullable: true })
  email?: string;

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }
  }

  @BeforeUpdate()
  hashPasswordBeforeUpdate() {
    if (this.password) {
      this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }
  }

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
  
  @Column({ nullable: true })
  tgChatId?: number;

  @Column({ type: 'timestamptz', nullable: true })
  inviteEndAt: Date;

  @OneToMany(() => PatientNotification, (pn) => pn.patient, { cascade: true })
  notifications?: PatientNotification;

  @OneToMany(() => DoctorNotification, (dn) => dn.patient, { cascade: true })
  doctorNotifications?: PatientNotification;

  @OneToMany(() => PatientAnalyzes, (pa) => pa.patient, { cascade: true })
  analyzes: PatientAnalyzes;
}
