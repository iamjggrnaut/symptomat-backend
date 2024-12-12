import { Field, ObjectType } from '@nestjs/graphql';

import { pickObject } from '../../utils/pick-object';
import { Doctor } from '../entities';
import { DoctorModel } from './doctor.model';

@ObjectType()
export class DoctorInvitationModel extends DoctorModel {
  private constructor(data: Partial<DoctorInvitationModel>) {
    super(data);
    Object.assign(this, data);
  }

  static create(props: Doctor) {
    const doctorInvitationModel = new DoctorInvitationModel({
      ...pickObject(props, [
        'id',
        'email',
        'createdAt',
        'deletedAt',
        'updatedAt',
        'role',
        'language',
        'notificationsSettings',
      ]),
    });
    doctorInvitationModel.doctorId = props.id;
    return doctorInvitationModel;
  }

  @Field(() => Boolean, { nullable: true })
  isInviteAccepted?: boolean | null;

  /*
    doctor, who hasnt signup, not added to the doctors entity and doesnt have  id in this table
    front-end app needs uniq not null id for each doctors
    so in DoctorInvitationModel: id - uniq index, doctorId - id in doctors entity
  */
  @Field(() => String, { nullable: true })
  doctorId?: string;
}
