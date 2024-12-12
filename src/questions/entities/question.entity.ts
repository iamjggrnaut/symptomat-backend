import { Base } from 'src/common/entities/base.entity';
import { Doctor } from 'src/doctors/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { QuestionIndicators } from '../questions.indicators.types';
import { QuestionType } from '../questions.types';
import { QuestionCategoryQuestion, QuestionOption } from '.';

const tableName = 'questions';

@Entity({ name: tableName })
export class Question extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctor, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor?: Doctor;

  @Column({ type: 'uuid', nullable: true })
  doctorId: string | null;

  @ManyToOne(() => QuestionCategoryQuestion, (questionCategoryQuestion) => questionCategoryQuestion.questionId, {
    onDelete: 'CASCADE',
  })
  questionCategoryQuestions?: QuestionCategoryQuestion[];

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'jsonb', nullable: true })
  indicators: QuestionIndicators | null;

  @Column({ type: 'text' })
  title: string;

  @Column({
    default: false,
  })
  isCustom: boolean;

  @Column({ type: 'boolean', default: false })
  isActual: boolean;

  @OneToMany(() => QuestionOption, (qo) => qo.question, { cascade: true })
  questionOptions: QuestionOption[];
}
