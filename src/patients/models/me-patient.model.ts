import { Field, ObjectType } from '@nestjs/graphql';
import { FieldFromResolver } from 'src/common/decorators';
import { HospitalPatientModel } from 'src/hospitals/models';
import { pickObject } from 'src/utils/pick-object';

import { Patient } from '../entities/patient.entity';
import { PatientModelBase } from './patient-base.model';
import { PatientNotificationsSettingsModel } from '.';

@ObjectType()
export class MePatientModel extends PatientModelBase {
  private constructor(data: Partial<MePatientModel>) {
    super(data);
    Object.assign(this, data);
  }

  static create(props: Patient) {
    return new MePatientModel({
      ...pickObject(props, [
        'id',
        'email',
        'fcmToken',
        'createdAt',
        'deletedAt',
        'updatedAt',
        'role',
        'isFirstSignUp',
        'notificationsSettings',
      ]),
    });
  }

  @Field(() => Boolean)
  isFirstSignUp: boolean;

  @Field({ nullable: true })
  fcmToken?: string;

  @FieldFromResolver(() => [HospitalPatientModel])
  hospitals: HospitalPatientModel[];

  @Field(() => PatientNotificationsSettingsModel)
  notificationsSettings: PatientNotificationsSettingsModel;
}
