import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-dataloader';
import { Hospital } from 'src/hospitals/entities';
import { HospitalModel } from 'src/hospitals/models/hospital.model';

import { HospitalByDoctorLoader } from '../dataloaders/hospital-by-doctor.dataloader';
import { DoctorModel } from '../models/doctor.model';

@Resolver(() => DoctorModel)
export class DoctorResolver {
  @ResolveField()
  public async hospital(
    @Parent()
    doctor: DoctorModel,
    @Loader(HospitalByDoctorLoader.name)
    loader: DataLoader<string, Hospital>,
  ) {
    return HospitalModel.create(await loader.load(doctor.id));
  }
}
