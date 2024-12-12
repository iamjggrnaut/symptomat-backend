import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Patient } from '../../patients/entities';
import { Doctor } from './doctor.entity';

const tableName = 'doctors_patients';
@Unique('DOCTORS_PATIENTS_UQ', ['patientId'])
@Entity({ name: tableName })
export class DoctorPatient extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;
}
