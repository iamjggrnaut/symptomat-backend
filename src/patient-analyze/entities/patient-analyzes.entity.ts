import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Patient } from '../../patients/entities/patient.entity';

const tableName = 'patient_analyzes';

@Entity({ name: tableName })
export class PatientAnalyzes extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @Column({ type: 'text' })
  filename: string;

  @ManyToOne(() => Patient, (patient) => patient.analyzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'text' })
  fileKey: string;

  @Column({ default: false })
  isViewed: boolean;
}
