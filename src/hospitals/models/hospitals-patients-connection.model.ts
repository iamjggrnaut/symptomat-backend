import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { HospitalPatientModel } from './hospital-patient.model';

@ObjectType()
export class HospitalsPatientsConnection {
  @Field(() => [HospitalPatientModel])
  nodes: Partial<HospitalPatientModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
