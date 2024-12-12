import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';

import { DoctorInvitationModel } from '.';

@ObjectType()
export class DoctorConnection {
  @Field(() => [DoctorInvitationModel])
  nodes: Partial<DoctorInvitationModel>[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
