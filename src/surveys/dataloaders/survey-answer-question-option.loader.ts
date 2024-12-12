import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import _ from 'lodash';
import { DataLoaderInterface } from 'src/common/types';
import { QuestionOption } from 'src/questions/entities';
import { In } from 'typeorm';

import { SurveyAnswersRepository } from '../repositories';

@Injectable()
export class SurveyAnswerQuestionOptionLoader implements DataLoaderInterface<string, QuestionOption> {
  constructor(private readonly surveyAnswersRepository: SurveyAnswersRepository) {}

  generateDataLoader() {
    return new DataLoader(async (surveyAnswersIds: string[]) => {
      const surveysAnswers = await this.surveyAnswersRepository.find({
        where: {
          id: In(surveyAnswersIds),
        },
        relations: ['answerQuestionOption'],
      });

      const surveysAnswersById = _.keyBy(surveysAnswers, (surveyAnswer) => surveyAnswer.id);
      return surveyAnswersIds.map((surveyAnswerId) => surveysAnswersById[surveyAnswerId].answerQuestionOption || null);
    });
  }
}
