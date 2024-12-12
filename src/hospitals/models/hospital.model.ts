import { Field, Int, ObjectType } from '@nestjs/graphql';
import { pickObject } from 'src/utils/pick-object';

import { Hospital } from '../entities';

@ObjectType()
export class HospitalModel {
  private constructor(data: Partial<HospitalModel>) {
    Object.assign(this, data);
  }

  @Field(() => String)
  name: string;

  @Field(() => String)
  id: string;

  @Field(() => Int)
  patientsLimit: number;

  static create(props: Hospital) {
    return new HospitalModel({
      ...pickObject(props, ['name', 'id', 'patientsLimit']),
    });
  }
}
