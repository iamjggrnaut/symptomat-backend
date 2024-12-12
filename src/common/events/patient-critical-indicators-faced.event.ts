export class PatientCriticalIndicatorsFacedEvent {
  constructor(data: Partial<PatientCriticalIndicatorsFacedEvent>) {
    Object.assign(this, data);
  }
  patientId: string;
  doctorId: string;
  criticalSurveyAnswersIds: string[];
  surveyTemplateId: string;
}
