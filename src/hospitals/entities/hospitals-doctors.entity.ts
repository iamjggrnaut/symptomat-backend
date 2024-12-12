import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Hospital } from './hospital.entity';

const tableName = 'hospitals_doctors';

@Unique('HOSPITALS_DOCTORS_UQ', ['doctorId', 'hospitalId'])
@Entity({ name: tableName })
export class HospitalsDoctors extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @Column({ type: 'uuid' })
  hospitalId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.hospitalsDoctors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @ManyToOne(() => Hospital, (h) => h.hospitalDoctors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;
}
