import { Base } from 'src/common/entities/base.entity';
import { Question, QuestionOption } from 'src/questions/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SurveyAnswerValue } from '../surveys.answer-value.types';
import { Survey } from '.';

const tableName = 'survey_answers';
@Entity({ name: tableName })
export class SurveyAnswer extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isCritical: boolean;

  // Field not null if question type is not "radio" or "checkbox"
  // TODO: add constraint
  @Column({ type: 'jsonb', nullable: true })
  answerValue: SurveyAnswerValue | null;

  // Field not null if question type is "radio"
  // TODO: add constraint
  @Column({ type: 'uuid', nullable: true })
  answerQuestionOptionId: string | null;

  // Field not null if question type is "checkbox"
  // TODO: add constraint
  @Column({ type: 'uuid', array: true, nullable: true })
  answerQuestionOptionsIds: string[] | null;

  @ManyToOne(() => QuestionOption, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'answerQuestionOptionId' })
  answerQuestionOption?: QuestionOption | null;

  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'uuid' })
  surveyId: string;

  @ManyToOne(() => Survey, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;
}
