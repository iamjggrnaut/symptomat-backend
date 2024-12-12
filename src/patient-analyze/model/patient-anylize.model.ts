import { Field, ObjectType } from '@nestjs/graphql';
import { pickObject } from 'src/utils/pick-object';

import { PatientAnalyzes } from '../entities/patient-analyzes.entity';

@ObjectType()
export class PatientAnalyzeModel {
  private constructor(data: Partial<PatientAnalyzeModel>) {
    Object.assign(this, data);
  }

  static create(
    props: Pick<PatientAnalyzes, 'fileKey' | 'id' | 'patientId' | 'filename' | 'createdAt' | 'doctorId' | 'isViewed'>,
  ) {
    return new PatientAnalyzeModel({
      ...pickObject(props, ['fileKey', 'patientId', 'id', 'filename', 'createdAt', 'doctorId', 'isViewed']),
    });
  }

  @Field(() => String)
  id: string;

  @Field(() => String)
  filename: string;

  @Field(() => String)
  fileKey: string;

  @Field(() => String)
  patientId: string;

  @Field(() => String)
  doctorId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Boolean)
  isViewed: boolean;
}
