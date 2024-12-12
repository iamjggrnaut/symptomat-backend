import { Injectable } from '@nestjs/common';

import { SurveyTemplatesRepository } from '../repositories/survey-templates.repository';

@Injectable()
export class SurveyTemplatesService {
  constructor(private readonly surveyTemplatesRepository: SurveyTemplatesRepository) {}

  async findOne(surveyTemplateId: string) {
    return this.surveyTemplatesRepository.findOne(surveyTemplateId);
  }
}
