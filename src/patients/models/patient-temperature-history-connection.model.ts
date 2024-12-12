import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { PatientTemperatureHistoryItemModel } from './patient-temperature-history-item.model';

@ObjectType()
export class PatientTemperatureHistoryConnection {
  @Field(() => [PatientTemperatureHistoryItemModel])
  nodes: Partial<PatientTemperatureHistoryItemModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
