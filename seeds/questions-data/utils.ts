import { Drug, DrugsQuestions } from "src/drugs/entities";
import { QuestionCategory } from "src/question-categories/question-category.entity";
import { Question, QuestionCategoryQuestion, QuestionOption } from "src/questions/entities";
import { DeepPartial } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export type DeepPartialDrug = DeepPartial<Drug>;
export type DeepPartialQuestion = DeepPartial<Question>;
export type DeepPartialQuestionOption = DeepPartial<QuestionOption>;
export type DeepPartialDrugsQuestions = DeepPartial<DrugsQuestions>;
export type DeepPartialQuestionCategory = DeepPartial<QuestionCategory>;
export type DeepPartialQuestionCategoryQuestion = DeepPartial<QuestionCategoryQuestion>;

export const createQuestion = (questionData: DeepPartialQuestion): DeepPartialQuestion => ({
  id: uuidv4(),
  ...questionData,
});

export const createQuestionCategory = (questionCategoryData: DeepPartialQuestionCategory): DeepPartialQuestionCategory => ({
  id: uuidv4(),
  ...questionCategoryData,
});

export const createQuestionCategoryQuestions = (question: DeepPartialQuestion, questionCategory: DeepPartialQuestionCategory): DeepPartialQuestionCategoryQuestion => ({
  // id: uuidv4(),
  questionId: question.id,
  questionCategoryId: questionCategory.id,
  //...questionCategoryQuestionData,
})

export const createQuestionOptions = (question: DeepPartialQuestion, questionsTexts: string[]): DeepPartialQuestionOption[] => {
  return questionsTexts.map((text, index) => ({
    text,
    index,
    questionId: question.id,
  }));
};

export const createDrug = (name: string): DeepPartialDrug => ({
  id: uuidv4(),
  name,
});

export const createDrugsQuestions = (options: { drug: DeepPartialDrug, questions: DeepPartialQuestion[] }): DeepPartialDrugsQuestions[] => {
  const { drug, questions } = options;
  return questions.map((question) => ({
    drugId: drug.id,
    questionId: question.id,
  }));
};