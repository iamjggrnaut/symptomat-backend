import { Doctor } from 'src/doctors/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { PatientNotificationKind, PatientNotificationsExtraData } from '../patients.types';
import { Patient } from './patient.entity';

const tableName = 'patient_notifications';
@Entity({ name: tableName })
export class PatientNotification extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient, (patient) => patient.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: PatientNotificationKind,
  })
  kind: PatientNotificationKind;

  @Column({ type: 'jsonb' })
  extraData: PatientNotificationsExtraData | null;

  @ManyToOne(() => Doctor, (doctor) => doctor.patientNotifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ type: 'uuid' })
  doctorId: string;

  @Column({ default: false })
  isRead: boolean;
}
