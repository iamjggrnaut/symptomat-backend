import { Field, ObjectType } from '@nestjs/graphql';
import { FieldFromResolver } from 'src/common/decorators';
import { UUID } from 'src/common/scalars/uuid.scalar';

import { HospitalPatient } from '../entities';

// import { SurveyStatus } from 'src/surveys/surveys.types';

@ObjectType()
export class HospitalPatientModel {
  @Field(() => UUID)
  id: string;

  @Field(() => UUID)
  patientId: string;

  @Field(() => UUID)
  hospitalId: string;

  @Field(() => String)
  medicalCardNumber: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  doctorId: string | null;

  @Field(() => Date)
  createdAt: Date;

  @FieldFromResolver(() => Boolean)
  hasActiveSurvey: boolean;

  private constructor(data: HospitalPatientModel) {
    Object.assign(this, data);
  }

  static create(
    props: Pick<
      HospitalPatient,
      'id' | 'patientId' | 'hospitalId' | 'medicalCardNumber' | 'firstName' | 'lastName' | 'createdAt'
    > & {
      doctorId?: string | null;
      hasActiveSurvey?: boolean;
    },
  ) {
    return new HospitalPatientModel({
      ...props,
      doctorId: props.doctorId || null,
      hasActiveSurvey: props.hasActiveSurvey,
    });
  }
}
