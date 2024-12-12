import { Base } from 'src/common/entities/base.entity';
import { Drug } from 'src/drugs/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SurveyTemplate } from './survey-template.entity';

const tableName = 'survey_templates_drugs';

@Entity({ name: tableName })
export class SurveyTemplatesDrug extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  drugId: string;

  @ManyToOne(() => Drug, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'drugId' })
  drug: Drug;

  @Column({ type: 'uuid' })
  templateId: string;

  @ManyToOne(() => SurveyTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'templateId' })
  template: SurveyTemplate;
}
