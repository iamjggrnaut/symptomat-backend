import { Patient } from 'src/patients/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { DoctorNotificationKind, DoctorNotificationsExtraData } from '../doctors.types';
import { Doctor } from './doctor.entity';

const tableName = 'doctor_notifications';

@Entity({ name: tableName })
export class DoctorNotification extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.doctorNotifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: DoctorNotificationKind,
  })
  kind: DoctorNotificationKind;

  @Column({ type: 'jsonb', nullable: true })
  extraData: DoctorNotificationsExtraData | null;

  @Column({ default: false })
  isRead: boolean;
}
