export class PatientDoctorContactRequestEvent {
  constructor(data: Partial<PatientDoctorContactRequestEvent>) {
    Object.assign(this, data);
  }
  patientId: string;
  doctorId: string;
  message: string;
}
