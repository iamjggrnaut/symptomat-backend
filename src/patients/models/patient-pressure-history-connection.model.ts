import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { PatientPressureHistoryItemModel } from './patient-pressure-history-item.model';

@ObjectType()
export class PatientPressureHistoryConnection {
  @Field(() => [PatientPressureHistoryItemModel])
  nodes: Partial<PatientPressureHistoryItemModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
