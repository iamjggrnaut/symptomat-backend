import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import _ from 'lodash';
import { DataLoaderInterface } from 'src/common/types';
import { SurveyTemplate } from 'src/survey-templates/entities';
import { In } from 'typeorm';

import { SurveysRepository } from '../repositories';

@Injectable()
export class SurveySurveyTemplateLoader implements DataLoaderInterface<string, SurveyTemplate> {
  constructor(private readonly surveysRepository: SurveysRepository) {}

  generateDataLoader() {
    return new DataLoader(async (surveysIds: string[]) => {
      const surveys = await this.surveysRepository.find({
        where: {
          id: In(surveysIds),
        },
        relations: ['template'],
      });

      const surveysById = _.keyBy(surveys, (survey) => survey.id);
      return surveysIds.map((surveyId) => surveysById[surveyId].template);
    });
  }
}
