import _ from 'lodash';
import { EntityRepository, In, Repository } from 'typeorm';

import { SurveyTemplatesDrug } from '../entities';

@EntityRepository(SurveyTemplatesDrug)
export class SurveyTemplatesDrugsRepository extends Repository<SurveyTemplatesDrug> {
  async loadSurveyTemplatesDrugs(surveyTemplatesIds: string[]) {
    const surveyTemplatesDrugs = await this.find({
      where: {
        templateId: In(surveyTemplatesIds),
      },
      relations: ['drug'],
    });

    const surveyTemplatesDrugsGroups = _.groupBy(surveyTemplatesDrugs, 'templateId');

    return surveyTemplatesIds.map((surveyTemplateId) => {
      return surveyTemplatesDrugsGroups[surveyTemplateId] || [];
    });
  }
}
