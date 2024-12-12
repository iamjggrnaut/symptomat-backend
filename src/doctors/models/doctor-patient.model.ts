import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'src/common/scalars/uuid.scalar';

import { DoctorPatient } from '../entities';

@ObjectType()
export class DoctorPatientModel {
  @Field(() => UUID)
  id: string;

  @Field(() => UUID)
  patientId: string;

  @Field(() => UUID)
  doctorId: string;

  private constructor(data: Partial<DoctorPatient>) {
    Object.assign(this, data);
  }

  static create(props: DoctorPatient) {
    const doctorModel = new DoctorPatientModel(props);
    return doctorModel;
  }
}
