import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DataLoaderInterface } from 'src/common/types';

import { SurveyTemplateQuestion } from '../entities';
import { SurveyTemplatesQuestionsRepository } from '../repositories';

@Injectable()
export class SurveyTemplateQuestionsLoader implements DataLoaderInterface<string, SurveyTemplateQuestion[]> {
  constructor(private readonly surveyTemplatesQuestionsRepository: SurveyTemplatesQuestionsRepository) {}

  generateDataLoader() {
    return new DataLoader((surveyTemplatesIds: string[]) => {
      return this.surveyTemplatesQuestionsRepository.loadSurveyTemplatesQuestions(surveyTemplatesIds);
    });
  }
}
