import { BadRequestException } from '@nestjs/common';
import xlsx from 'node-xlsx';
import { Drug, DrugsQuestions } from 'src/drugs/entities';
import { QuestionCategory } from 'src/question-categories/question-category.entity';
import { Question, QuestionCategoryQuestion, QuestionOption } from 'src/questions/entities';
import {
  NumericQuestionIndicators,
  QuestionIndicators,
  ScaleQuestionIndicators,
} from 'src/questions/questions.indicators.types';
import { QuestionType } from 'src/questions/questions.types';
import { In, getConnection } from 'typeorm';

import { CategoryToQuestion, QuestionToDrug, XlsxQuestionInfo, XlsxRaw, XlsxValue } from '../drugs-xls.types';

export class DrugsXlsService {
  private readonly xlsxQuestionTypes = {
    Радио: QuestionType.RADIO,
    Чекбокс: QuestionType.CHECKBOX,
    Числовой: QuestionType.NUMERIC,
    Шкала: QuestionType.SCALE,
    Давление: QuestionType.PRESSURE,
    Температура: QuestionType.TEMPERATURE,
    Вес: QuestionType.WEIGHT,
    Пульс: QuestionType.PULSE,
  };

  async parse(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File with key 'drugs' is required!");
    }
    const [{ data: drugRaws }] = xlsx.parse(file.buffer) as {
      name: string;
      data: XlsxRaw[];
    }[];

    // read xlsx file and get drugs (from first column) and info about questions for drugs (from other columns)
    // ref between drug and questions by array index (drugs[0] -> questions[0], drugs[1] -> questions[1])
    const { drugs: xlsxDrugs, questions: xlsxQuestions } = this.parseXlsxTabel(drugRaws);

    // parse read info about questions to questions, category and category-question ref
    // ref between arrays by array index like in drug and questions
    const { categoryToQuestions, drugQuestions, uniqCategories } = this.parseQuestionRaws(xlsxQuestions);

    let questionToDrugs: QuestionToDrug[] = [];
    const uniqQuestions: Question[] = [];
    drugQuestions.forEach((questionsForOneDrug, drugIndex) => {
      questionsForOneDrug.forEach((question) => {
        let questionIndex = uniqQuestions.findIndex((elem) => elem.title === question.title);
        if (questionIndex === -1) {
          uniqQuestions.push(question);
          questionIndex = uniqQuestions.length - 1;
        }
        questionToDrugs.push({
          drugIndex,
          questionIndex,
          questionId: null,
        });
      });
    });

    // with transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // hide old questions for search
      await queryRunner.manager.update(
        Question,
        {
          isCustom: false,
          title: In(uniqQuestions.map((question) => question.title)),
          doctorId: null,
          isActual: true,
        },
        {
          isActual: false,
        },
      );

      // find exists categories
      const databaseCategories = await queryRunner.manager.find(QuestionCategory, {
        where: {
          name: In(uniqCategories.map((category) => category.name)),
        },
      });
      const databaseCategoriesName = databaseCategories.map((category) => category.name);

      // add new actual questions
      const savedQuestionsQuery = Promise.all(
        uniqQuestions.map((question) =>
          queryRunner.manager.save(
            queryRunner.manager.create(Question, { ...question, isCustom: false, isActual: true }),
          ),
        ),
      ).then((res) => {
        questionToDrugs = questionToDrugs.map((elem) => {
          elem.questionId = res[elem.questionIndex].id;
          return elem;
        });

        return res;
      });

      // save dont exists categories
      const savedCategoriesQuery = queryRunner.manager.save(
        uniqCategories.filter((category) => !databaseCategoriesName.includes(category.name)),
      );

      // saved questions = all questions ([...savedQuestions, ...databaseQuestions])
      const [savedQuestions, savedCategories] = await Promise.all([savedQuestionsQuery, savedCategoriesQuery]);

      const categories = [...databaseCategories, ...savedCategories];

      // ref category -> question
      const categoryToQuestion = categoryToQuestions
        .map((categoryToQuestion) => {
          const categoryToQuestionEntity = new QuestionCategoryQuestion();

          categoryToQuestionEntity.questionId = savedQuestions.find(
            (question) => question.title === categoryToQuestion.questionName,
          ).id;

          categoryToQuestionEntity.questionCategoryId = categories.find(
            (category) => category.name === categoryToQuestion.categoryName,
          ).id;

          return categoryToQuestionEntity;
        })
        .reduce((acc, questionCategory) => {
          const repeatIndex = acc.findIndex(
            (cq) =>
              cq.questionCategoryId === questionCategory.questionCategoryId &&
              cq.questionId === questionCategory.questionId,
          );
          if (repeatIndex === -1) {
            acc.push(questionCategory);
          }
          return acc;
        }, [] as QuestionCategoryQuestion[]);

      // find exists drugs
      const databaseDrugs = await queryRunner.manager.find(Drug, {
        where: { name: In(xlsxDrugs.map((drug) => drug.name)) },
      });
      const databaseDrugsName = databaseDrugs.map((drug) => drug.name);

      // save dont exists drugs
      const savedDrugs = await queryRunner.manager.save(
        xlsxDrugs.filter((drug) => !databaseDrugsName.includes(drug.name)),
      );
      const drugs = [...databaseDrugs, ...savedDrugs];

      // remove old drugsQuestions
      const drugsIds = drugs.map((drug) => drug.id);
      await queryRunner.manager.delete(DrugsQuestions, { drugId: In(drugsIds) });

      // get drug -> question ref by database id
      const questionDrugEntities = questionToDrugs.map((questionToDrug) => {
        // find needed drug
        const drugName = xlsxDrugs[questionToDrug.drugIndex].name;
        const drug = drugs.find((drug) => drug.name === drugName);

        return queryRunner.manager.create(DrugsQuestions, { drugId: drug.id, questionId: questionToDrug.questionId });
      });

      await Promise.all([queryRunner.manager.save(questionDrugEntities), queryRunner.manager.save(categoryToQuestion)]);

      await queryRunner.commitTransaction();

      return drugs;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private parseXlsxTabel(table: XlsxRaw[]): { drugs: Drug[]; questions: Array<XlsxQuestionInfo[]> } {
    const isEmpty = (value: any) => typeof value !== 'string' && typeof value !== 'number';

    const questions: Array<XlsxQuestionInfo[]> = [];
    const drugs: Drug[] = [];

    table.map(([drugName, ...drugInfo]) => {
      if (!drugName) {
        return;
      }

      const drug = new Drug();
      drug.name = String(drugName);
      drugs.push(drug);

      const questionInfos = drugInfo.reduce((acc, column, index) => {
        const prevColumn = drugInfo[index - 1];

        if (isEmpty(column)) {
          return acc;
        }
        if (typeof column === 'string') {
          column = column.trim();
        }

        if (isEmpty(prevColumn)) {
          const newQuestionInfo: XlsxValue[] = [column];
          return [...acc, newQuestionInfo];
        }

        const lastQuestionInfo = acc[acc.length - 1];
        const extendedQuestionInfo = [...lastQuestionInfo, column];

        return [...acc.slice(0, -1), extendedQuestionInfo];
      }, [] as XlsxRaw[]);

      questions.push(
        questionInfos.map(([name, category, type, ...questionAnswers]) => ({
          name,
          category,
          type,
          questionAnswers,
        })),
      );
    });

    return { drugs, questions };
  }

  private parseQuestionRaws(
    xlsxQuestions: Array<XlsxQuestionInfo[]>,
  ): {
    drugQuestions: Array<Question[]>;
    categoryToQuestions: CategoryToQuestion[];
    uniqCategories: QuestionCategory[];
  } {
    const categoryToQuestions: CategoryToQuestion[] = [];
    const uniqCategories: QuestionCategory[] = [];

    const drugQuestions: Array<Question[]> = xlsxQuestions.map((drugQuestionsInfo) => {
      return drugQuestionsInfo.map((questionInfo) => {
        const question = new Question();
        question.title = String(questionInfo.name);
        question.type = this.xlsxQuestionTypes[questionInfo.type];

        const categoryIndex = uniqCategories.findIndex((category) => category.name === questionInfo.category);

        if (categoryIndex === -1) {
          const category = new QuestionCategory();
          category.name = String(questionInfo.category);
          uniqCategories.push(category);
        }
        categoryToQuestions.push({
          categoryName: String(questionInfo.category),
          questionName: question.title,
        });

        if (question.type === QuestionType.CHECKBOX || question.type === QuestionType.RADIO) {
          this.createQuestionOptions(question, questionInfo.questionAnswers);
        }
        if (question.type === QuestionType.NUMERIC || question.type === QuestionType.SCALE) {
          this.createQuestionIndicators(question, questionInfo.questionAnswers.map(Number));
        }
        return question;
      });
    });

    return { drugQuestions, categoryToQuestions, uniqCategories };
  }

  private createQuestionOptions(question: Question, questionAnswers: XlsxRaw) {
    const questionOptions: QuestionOption[] = questionAnswers.map((questionAnswer, index) => {
      const questionOption = new QuestionOption();
      questionOption.text = String(questionAnswer);
      questionOption.index = question.type === QuestionType.RADIO ? index : 0;

      return questionOption;
    });

    question.questionOptions = questionOptions;
  }

  private createQuestionIndicators(question: Question, values: number[]) {
    const indicator = new QuestionIndicators();
    const indicatorConstructor = {
      [QuestionType.NUMERIC]: NumericQuestionIndicators,
      [QuestionType.SCALE]: ScaleQuestionIndicators,
    };

    indicator[question.type] = new indicatorConstructor[question.type]();
    indicator[question.type] = {
      minValue: values[0],
      maxValue: values[1],
    };

    question.indicators = indicator;
  }
}
