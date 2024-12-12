import { EntityRepository, Repository } from 'typeorm';

import { SurveyTemplate } from '../entities';
import { SurveyTemplateStatus } from '../survey-templates.types';

@EntityRepository(SurveyTemplate)
export class SurveyTemplatesRepository extends Repository<SurveyTemplate> {
  async loadPatientSurveyTemplateStatus(patientsIds: string[]) {
    const qb = this.createQueryBuilder('survey_templates')
      .select(['survey_templates."patientId" AS "patientId"', 'survey_templates."status" AS "status"'])
      .where('survey_templates."patientId" IN (:...patientsIds) AND survey_templates."status" = :surveyStatus', {
        patientsIds,
        surveyStatus: SurveyTemplateStatus.ACTIVE,
      })
      .groupBy('survey_templates."patientId", survey_templates."status"');

    type RawPatientsStatuses = Array<{
      patientId: number;
      status: SurveyTemplateStatus;
    }>;
    const rawPatientsStatuses: RawPatientsStatuses = await qb.getRawMany();

    const patientsStatuses: Record<string, boolean> = rawPatientsStatuses.reduce((acc, { patientId, status }) => {
      return { ...acc, [patientId]: status == SurveyTemplateStatus.ACTIVE };
    }, {});

    return patientsIds.map((patientId) => patientsStatuses[patientId] || false);
  }

  async loadPatientSurveyTemplateIds(patientId: string, doctorId: string): Promise<string[]> {
    const qb = this.createQueryBuilder('survey_templates')
      .select('survey_templates."id" AS "id"')
      .where('survey_templates."patientId" = :patientId', { patientId })
      .andWhere('survey_templates."doctorId" = :doctorId', { doctorId });
    const templatesIds: { id: string }[] = await qb.getRawMany();
    return templatesIds.map((template) => template.id);
  }
}
