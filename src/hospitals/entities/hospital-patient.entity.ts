import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Patient } from '../../patients/entities';
import { Hospital } from '.';

const tableName = 'hospitals_patients';

@Unique('HOSPITALS_PATIENTS_UQ', ['hospitalId', 'patientId'])
@Entity({ name: tableName })
export class HospitalPatient extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @Column({ type: 'uuid' })
  hospitalId: string;

  @Column({ type: 'text' })
  medicalCardNumber: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;
}
