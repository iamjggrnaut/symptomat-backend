import { Base } from 'src/common/entities/base.entity';
import { Question } from 'src/questions/entities';
import { QuestionOption } from 'src/questions/entities/question-option.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { SurveyTemplateQuestionCriticalIndicators } from '../survey-templates.question-critical-indicators.types';
import { SurveyTemplate } from './survey-template.entity';

const tableName = 'survey_templates_questions';

@Unique('SURVEY_TEMPLATES_QUESTIONS_UQ', ['templateId', 'questionId'])
@Entity({ name: tableName })
export class SurveyTemplateQuestion extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  criticalIndicators: SurveyTemplateQuestionCriticalIndicators | null;

  @ManyToOne(() => SurveyTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'templateId' })
  template: SurveyTemplate;

  @Column({ type: 'uuid' })
  templateId: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question?: Question;

  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => QuestionOption, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'criticalAnswerId' })
  criticalAnswer?: QuestionOption | null;

  @Column({ type: 'uuid', nullable: true })
  criticalAnswerId: string | null;

  @Column({ type: 'uuid', array: true, nullable: true })
  criticalAnswersIds: string[] | null;
}
