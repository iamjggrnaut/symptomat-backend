export class PatientAnalyzesCreatedEvent {
  constructor(data: Partial<PatientAnalyzesCreatedEvent>) {
    Object.assign(this, data);
  }
  patientId: string;
  doctorId: string;
}
