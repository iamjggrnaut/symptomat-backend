import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Question } from '.';

const tableName = 'question_options';

@Entity({ name: tableName })
export class QuestionOption extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'int' })
  index: number;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question?: Question;

  @Column()
  questionId: string;
}
