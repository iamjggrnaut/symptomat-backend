import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { PatientPulseHistoryItemModel } from './patient-pulse-history-item.model';

@ObjectType()
export class PatientPulseHistoryConnection {
  @Field(() => [PatientPulseHistoryItemModel])
  nodes: Partial<PatientPulseHistoryItemModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
