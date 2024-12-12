import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DataLoaderInterface } from 'src/common/types';

import { SurveyTemplatesQuestionsRepository } from '../repositories';

@Injectable()
export class SurveyTemplateQuestionsCountLoader implements DataLoaderInterface<string, number> {
  constructor(private readonly surveyTemplatesQuestionsRepository: SurveyTemplatesQuestionsRepository) {}

  generateDataLoader() {
    return new DataLoader((surveyTemplatesIds: string[]) =>
      this.surveyTemplatesQuestionsRepository.loadSurveyTemplatesQuestionsCount(surveyTemplatesIds),
    );
  }
}
