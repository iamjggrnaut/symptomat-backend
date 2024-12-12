import { Base } from 'src/common/entities/base.entity';
import { Doctor } from 'src/doctors/entities';
import { Patient } from 'src/patients/entities';
import { SurveyTemplate } from 'src/survey-templates/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SurveyStatus } from '../surveys.types';

const tableName = 'surveys';

@Entity({ name: tableName })
export class Survey extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SurveyStatus,
  })
  status: SurveyStatus;

  @Column({ type: 'uuid' })
  templateId: string;

  @ManyToOne(() => SurveyTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'templateId' })
  template: SurveyTemplate;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;
}
