import { Field, ObjectType } from '@nestjs/graphql';
import { FieldFromResolver } from 'src/common/decorators/field-from-resolver.decorator';
import { Language } from 'src/common/types/users.types';
import { HospitalModel } from 'src/hospitals/models/hospital.model';

import { UsersModelBase } from '../../common/models/users.model';
import { pickObject } from '../../utils/pick-object';
import { Doctor } from '../entities';
import { DoctorNotificationSettingsModel } from './doctor-notification-settings.model';

@ObjectType()
export class DoctorModel extends UsersModelBase {
  protected constructor(data: Partial<DoctorModel>) {
    super(data);
    Object.assign(this, data);
  }

  static create(props: Doctor) {
    const doctorModel = new DoctorModel({
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
    return doctorModel;
  }

  @Field(() => Language, { nullable: true })
  language: Language;

  @Field(() => DoctorNotificationSettingsModel, { nullable: true })
  notificationsSettings: DoctorNotificationSettingsModel;

  @FieldFromResolver(() => HospitalModel, { nullable: true })
  hospital?: HospitalModel;
}
