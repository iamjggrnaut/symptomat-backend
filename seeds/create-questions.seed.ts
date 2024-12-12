import { Drug, DrugsQuestions } from 'src/drugs/entities';
import { QuestionCategory } from 'src/question-categories/question-category.entity';
import { Question, QuestionCategoryQuestion, QuestionOption } from 'src/questions/entities';
import { Connection, EntityTarget } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { drugs } from './questions-data/drugs';
import { drugsQuestions } from './questions-data/drugs-questions';
import { questions } from './questions-data/questions';
import { questionCategories } from './questions-data/question-categories';
import { questionsOptions } from './questions-data/questions-options';
import { questionCategoriesQuestions } from './questions-data/question-category-questions';

const { values: getValues } = Object;

export default class CreateQuestions implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<void> {
    const insertInto = <T extends EntityTarget<unknown>, V>(entity: T, values: V[]) => connection
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(values)
      .execute();

    const createDrugs = () => insertInto(Drug, getValues(drugs));
    const createQuestions = () => insertInto(Question, getValues(questions));
    const createQuestionsOptions = () => insertInto(QuestionOption, questionsOptions);
    const createDrugsQuestions = () => insertInto(DrugsQuestions, drugsQuestions);
    const createQuestionCategory = () => insertInto(QuestionCategory, getValues(questionCategories))
    const createQuestionCategoryQuestions = () => insertInto(QuestionCategoryQuestion, getValues(questionCategoriesQuestions))

    await createDrugs();
    await createQuestions();
    await createQuestionsOptions();
    await createDrugsQuestions();
    await createQuestionCategory();
    await createQuestionCategoryQuestions();
  }
}
