import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DataLoaderInterface } from 'src/common/types';

import { SurveyTemplatesDrug } from '../entities';
import { SurveyTemplatesDrugsRepository } from '../repositories';

@Injectable()
export class SurveyTemplateDrugsLoader implements DataLoaderInterface<string, SurveyTemplatesDrug[]> {
  constructor(private readonly surveyTemplatesDrugsRepository: SurveyTemplatesDrugsRepository) {}

  generateDataLoader() {
    return new DataLoader((surveyTemplatesIds: string[]) => {
      return this.surveyTemplatesDrugsRepository.loadSurveyTemplatesDrugs(surveyTemplatesIds);
    });
  }
}
