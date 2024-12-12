import { Field, ObjectType } from '@nestjs/graphql';
import { pickObject } from 'src/utils/pick-object';

import { Patient } from '../entities/patient.entity';
import { PatientModelBase } from './patient-base.model';
import { PatientNotificationsSettingsModel } from '.';

@ObjectType()
export class PatientModel extends PatientModelBase {
  private constructor(data: Partial<PatientModel>) {
    super(data);
  }

  static create(props: Patient): PatientModel {
    return new PatientModel({
      ...pickObject(props, ['id', 'role', 'notificationsSettings']),
    });
  }

  @Field(() => PatientNotificationsSettingsModel)
  notificationsSettings: PatientNotificationsSettingsModel;
}
