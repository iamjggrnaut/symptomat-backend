import { Base } from 'src/common/entities/base.entity';
import { Doctor } from 'src/doctors/entities';
import { Patient } from 'src/patients/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SurveyTemplateKind, SurveyTemplatePeriod, SurveyTemplateStatus } from '../survey-templates.types';

const tableName = 'survey_templates';

@Entity({ name: tableName })
export class SurveyTemplate extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  endAt: Date;

  @Column({
    type: 'enum',
    enum: SurveyTemplatePeriod,
  })
  period: SurveyTemplatePeriod;

  @Column({
    type: 'enum',
    enum: SurveyTemplateKind,
  })
  kind: SurveyTemplateKind;

  @Column({
    type: 'enum',
    enum: SurveyTemplateStatus,
    nullable: true,
  })
  status: SurveyTemplateStatus | null;

  @Column({ type: 'timestamp', nullable: true })
  lastSentAt: Date | null;

  @Column({ default: 0 })
  timezoneOffset: number;
}
