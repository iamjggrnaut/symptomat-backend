import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { pickObject } from 'src/utils/pick-object';

import { PatientNotification } from '../entities';
import { PatientNotificationKind, PatientNotificationsExtraData } from '../patients.types';

@ObjectType()
export class PatientNotificationModel {
  private constructor(data: Partial<PatientNotificationModel>) {
    Object.assign(this, data);
  }

  static create(props: PatientNotification) {
    const patientNotificationModel = new PatientNotificationModel({
      ...pickObject(props, ['id', 'patientId', 'kind', 'title', 'description', 'createdAt', 'extraData', 'isRead']),
    });
    return patientNotificationModel;
  }

  @Field(() => UUID)
  id: string;

  @Field(() => UUID)
  patientId: string;

  @Field(() => PatientNotificationKind)
  kind: PatientNotificationKind;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => PatientNotificationsExtraData)
  extraData: PatientNotificationsExtraData;

  @Field(() => Boolean)
  isRead: boolean;
}
