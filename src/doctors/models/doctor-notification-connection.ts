import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { DoctorNotificationModel } from './doctor-notification.model';

@ObjectType()
export class DoctorNotificationConnection {
  @Field(() => [DoctorNotificationModel])
  nodes: Partial<DoctorNotificationModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
