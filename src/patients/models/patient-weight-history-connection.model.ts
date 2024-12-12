import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { PatientWeightHistoryItemModel } from './patient-weight-history-item.model';

@ObjectType()
export class PatientWeightHistoryConnection {
  @Field(() => [PatientWeightHistoryItemModel])
  nodes: Partial<PatientWeightHistoryItemModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
