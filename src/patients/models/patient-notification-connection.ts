import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { PatientNotificationModel } from './patient-notification.model';

@ObjectType()
export class PatientNotificationConnection {
  @Field(() => [PatientNotificationModel])
  nodes: Partial<PatientNotificationModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
