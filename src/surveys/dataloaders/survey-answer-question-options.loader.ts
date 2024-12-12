import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import _ from 'lodash';
import { DataLoaderInterface } from 'src/common/types';
import { QuestionOption } from 'src/questions/entities';
import { QuestionOptionsRepository } from 'src/questions/repositories';
import { In } from 'typeorm';

import { SurveyAnswersRepository } from '../repositories';

@Injectable()
export class SurveyAnswerQuestionOptionsLoader implements DataLoaderInterface<string, QuestionOption[]> {
  constructor(
    private readonly surveyAnswersRepository: SurveyAnswersRepository,
    private readonly questionOptionsRepository: QuestionOptionsRepository,
  ) {}

  generateDataLoader() {
    return new DataLoader(async (surveyAnswersIds: string[]) => {
      const surveysAnswers = await this.surveyAnswersRepository.find({
        where: {
          id: In(surveyAnswersIds),
        },
      });
      const deppQuestionsOptionsIds = surveysAnswers.map((surveyAnswer) => {
        return surveyAnswer.answerQuestionOptionsIds || [];
      });

      const questionsOptionsIds = _.flatten(deppQuestionsOptionsIds);
      const uniqQuestionsOptionsIds = _.uniq(questionsOptionsIds);

      const questionsOptions = await this.questionOptionsRepository.findByIds(uniqQuestionsOptionsIds);

      return surveyAnswersIds.map((surveyAnswerId) => {
        const surveyAnswer = surveysAnswers.find(({ id }) => id === surveyAnswerId);
        const answerQuestionOptionsIds = surveyAnswer.answerQuestionOptionsIds || [];

        const answerQuestionOptions = answerQuestionOptionsIds.map((answerQuestionOptionId) => {
          const answerQuestionOption = questionsOptions.find((qo) => qo.id === answerQuestionOptionId);
          return answerQuestionOption;
        });

        return answerQuestionOptions.filter(Boolean);
      });
    });
  }
}
