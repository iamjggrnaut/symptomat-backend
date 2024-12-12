import { PublicImageLoader } from './common/dataloaders/public-image.loader';
import { HospitalByDoctorLoader } from './doctors/dataloaders/hospital-by-doctor.dataloader';
import { PatientHospitalsLoader } from './patients/dataloaders';
import { PatientsSurveyStatusLoader } from './patients/dataloaders/patient-survey-status.loader';
import { PatientsLoader } from './patients/dataloaders/patients.loader';
import { QuestionOptionsLoader } from './questions/dataloaders';
import {
  SurveyTemplateDrugsLoader,
  SurveyTemplateQuestionsCountLoader,
  SurveyTemplateQuestionsLoader,
} from './survey-templates/dataloaders';
import {
  SurveyAnswerQuestionOptionLoader,
  SurveyAnswerQuestionOptionsLoader,
  SurveySurveyTemplateLoader,
} from './surveys/dataloaders';

export const commonDataLoaders = [
  PatientsLoader,
  PublicImageLoader,
  HospitalByDoctorLoader,
  QuestionOptionsLoader,
  SurveyTemplateDrugsLoader,
  SurveyTemplateQuestionsLoader,
  SurveyTemplateQuestionsCountLoader,
  SurveySurveyTemplateLoader,
  PatientHospitalsLoader,
  PatientsSurveyStatusLoader,
  SurveyAnswerQuestionOptionLoader,
  SurveyAnswerQuestionOptionsLoader,
];
