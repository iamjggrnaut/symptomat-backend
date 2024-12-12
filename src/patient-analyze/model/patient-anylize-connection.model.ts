import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { PatientAnalyzeModel } from './patient-anylize.model';

@ObjectType()
export class PatientAnalyzeConnection {
  @Field(() => [PatientAnalyzeModel])
  nodes: Partial<PatientAnalyzeModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
