import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Question } from '../../questions/entities';
import { Drug } from './drug.entity';

const tableName = 'drugs_questions';

@Entity({ name: tableName })
export class DrugsQuestions extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  drugId: string;

  @ManyToOne(() => Drug, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'drugId' })
  drug?: Drug;

  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question?: Question;
}
