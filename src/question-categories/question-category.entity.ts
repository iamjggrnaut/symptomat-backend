import { QuestionCategoryQuestion } from 'src/questions/entities';
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

const tableName = 'question_categories';

@Entity({
  name: tableName,
})
export class QuestionCategory {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'text' })
  @Index({ unique: true })
  name: string;

  @OneToMany(() => QuestionCategoryQuestion, (questionCategoryQuestion) => questionCategoryQuestion.questionCategory)
  questionCategoryQuestions: QuestionCategoryQuestion[];
}
