export class DoctorCreatedSurveysEvent {
  constructor(data: Partial<DoctorCreatedSurveysEvent>) {
    Object.assign(this, data);
  }
  surveyIds: string[];
}
