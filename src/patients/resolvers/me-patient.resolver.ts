import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-dataloader';
import { HospitalPatientModel } from 'src/hospitals/models';

import { PatientHospitalsLoader } from '../dataloaders';
import { MePatientModel } from '../models/me-patient.model';
import { PatientBaseResolver } from './patient-base.resolver';

@Resolver(() => MePatientModel)
export class MePatientResolver extends PatientBaseResolver {
  @ResolveField(() => HospitalPatientModel)
  async hospitals(
    @Parent()
    mePatient: MePatientModel,
    @Loader(PatientHospitalsLoader.name)
    patientHospitalsLoader: DataLoader<string, HospitalPatientModel[]>,
  ) {
    const patientHospitals = await patientHospitalsLoader.load(mePatient.id);
    return patientHospitals.map((patientHospital) => HospitalPatientModel.create(patientHospital));
  }
}
