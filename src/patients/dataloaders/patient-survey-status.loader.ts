import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DataLoaderInterface } from 'src/common/types';
import { SurveyTemplatesRepository } from 'src/survey-templates/repositories';

@Injectable()
export class PatientsSurveyStatusLoader implements DataLoaderInterface<string, boolean> {
  constructor(private readonly surveyTemplatesRepository: SurveyTemplatesRepository) {}

  generateDataLoader() {
    return new DataLoader((patientsIds: string[]) => {
      return this.surveyTemplatesRepository.loadPatientSurveyTemplateStatus(patientsIds);
    });
  }
}
