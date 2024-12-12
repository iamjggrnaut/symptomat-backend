import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'src/common/scalars/uuid.scalar';
import { HospitalPatientModel } from 'src/hospitals/models';

import { DoctorNotificationKind, DoctorNotificationsExtraData } from '../doctors.types';
import { DoctorNotification } from '../entities';

@ObjectType()
export class DoctorNotificationModel {
  private constructor(data: Partial<DoctorNotificationModel>) {
    Object.assign(this, data);
  }

  static create(
    props: Pick<
      DoctorNotification,
      'id' | 'patientId' | 'doctorId' | 'kind' | 'title' | 'description' | 'createdAt' | 'extraData' | 'isRead'
    > & {
      hospitalPatient: HospitalPatientModel;
    },
  ) {
    return new DoctorNotificationModel({
      ...props,
      hospitalPatient: props.hospitalPatient,
    });
  }

  @Field(() => UUID)
  id: string;

  @Field(() => UUID)
  patientId: string;

  @Field(() => UUID)
  doctorId: string;

  @Field(() => DoctorNotificationKind)
  kind: DoctorNotificationKind;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => DoctorNotificationsExtraData, { nullable: true })
  extraData?: DoctorNotificationsExtraData;

  @Field(() => HospitalPatientModel, { nullable: true })
  hospitalPatient?: HospitalPatientModel;

  @Field(() => Boolean)
  isRead: boolean;
}
