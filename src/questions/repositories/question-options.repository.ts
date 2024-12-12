import _ from 'lodash';
import { SurveyAnswerStat } from 'src/surveys/surveys.types';
import { EntityRepository, In, Repository } from 'typeorm';

import { QuestionOption } from '../entities';

@EntityRepository(QuestionOption)
export class QuestionOptionsRepository extends Repository<QuestionOption> {
  async loadQuestionsOptions(questionsIds: string[]) {
    const questionsOptions = await this.find({
      where: {
        questionId: In(questionsIds),
      },
    });
    const questionsOptionsGroups = _.groupBy(questionsOptions, (questionOption) => questionOption.questionId);
    const result = questionsIds.map((questionId) => {
      const options = questionsOptionsGroups[questionId];
      if (!options) {
        return null;
      }

      return options.sort((a, b) => a.index - b.index);
    });

    return result;
  }

  async findBySurveyAnswersStats(stats: SurveyAnswerStat[]) {
    type QuestionId = string;
    type Result = Record<QuestionId, Record<number, QuestionOption>>;

    const qb = this.createQueryBuilder('question_options');

    const isNull = (value: unknown) => value === null;
    stats
      .filter((stat) => {
        const isMaxQuestionOptionIndexNull = isNull(stat.answerQuestionOptionMaxIndex);
        const isMinQuestionOptionIndexNull = isNull(stat.answerQuestionOptionMinIndex);
        return !isMaxQuestionOptionIndexNull || !isMinQuestionOptionIndexNull;
      })
      .forEach((stat) => {
        const { questionId, answerQuestionOptionMaxIndex, answerQuestionOptionMinIndex } = stat;
        const indexes = [answerQuestionOptionMaxIndex, answerQuestionOptionMinIndex].filter(
          (answerQuestionOptionIndex) => !isNull(answerQuestionOptionIndex),
        );
        qb.orWhere(`(question_options."questionId" = '${questionId}' AND question_options.index IN (${indexes}))`);
      });

    const questionOptions = await qb.getMany();
    const questionOptionsByQuestionId = _.groupBy(questionOptions, (questionOption) => questionOption.questionId);
    const questionOptionsByQuestionIdAndIndex: Result = _.mapValues(questionOptionsByQuestionId, (questionOptions) => {
      const questionOptionsByIndex = _.keyBy(questionOptions, 'index');
      return questionOptionsByIndex;
    });

    return questionOptionsByQuestionIdAndIndex;
  }
}
