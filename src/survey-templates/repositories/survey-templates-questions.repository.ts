import _ from 'lodash';
import { EntityRepository, Repository } from 'typeorm';

import { SurveyTemplateQuestion } from '../entities';

@EntityRepository(SurveyTemplateQuestion)
export class SurveyTemplatesQuestionsRepository extends Repository<SurveyTemplateQuestion> {
  async loadSurveyTemplatesQuestions(surveyTemplatesIds: string[]) {
    if (_.isEmpty(surveyTemplatesIds)) {
      return [];
    }
    const surveyTemplatesQuestions = await this.createQueryBuilder('survey_templates_questions')
      .leftJoinAndSelect('survey_templates_questions.question', 'question')
      .where('survey_templates_questions."templateId" IN (:...surveyTemplatesIds)', {
        surveyTemplatesIds,
      })
      .getMany();

    const surveyTemplatesQuestionsGroups = _.groupBy(surveyTemplatesQuestions, 'templateId');
    return surveyTemplatesIds.map((surveyTemplateId) => {
      return surveyTemplatesQuestionsGroups[surveyTemplateId] || [];
    });
  }

  async loadSurveyTemplatesQuestionsCount(surveyTemplatesIds: string[]) {
    const qb = this.createQueryBuilder('survey_templates_questions')
      .select([
        'CAST(COUNT(id) AS INTEGER) AS "questionsCount"',
        'survey_templates_questions."templateId" AS "templateId"',
      ])
      .where('survey_templates_questions."templateId" IN (:...surveyTemplatesIds)', {
        surveyTemplatesIds,
      })
      .groupBy('survey_templates_questions."templateId"');

    type RawQuestionsCount = Array<{
      templateId: number;
      questionsCount: number;
    }>;
    const rawQuestionsCounts: RawQuestionsCount = await qb.getRawMany();

    const questionsCounts: Record<string, number> = rawQuestionsCounts.reduce((acc, { templateId, questionsCount }) => {
      return { ...acc, [templateId]: questionsCount };
    }, {});

    return surveyTemplatesIds.map((templateId) => questionsCounts[templateId] || 0);
  }
}
