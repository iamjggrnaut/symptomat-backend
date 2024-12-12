import { QuestionCategory } from 'src/question-categories/question-category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Question } from '.';

const tableName = 'question_categories_questions';

@Entity({ name: tableName })
export class QuestionCategoryQuestion extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Question, (question) => question.questionCategoryQuestions)
  question?: Question;

  @Column()
  questionId: string;

  @ManyToOne(() => QuestionCategory, (questionCategory) => questionCategory.questionCategoryQuestions)
  questionCategory?: QuestionCategory;

  @Column()
  questionCategoryId: string;
}
