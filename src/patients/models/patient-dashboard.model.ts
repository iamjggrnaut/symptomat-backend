import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
class PatientDashboardPressureFieldModel {
  @Field(() => Float)
  upperValue: number;

  @Field(() => Float)
  lowerValue: number;
}

@ObjectType()
export class PatientDashboardModel {
  @Field(() => Float, { nullable: true })
  weight: number | null;

  @Field(() => Float, { nullable: true })
  pulse: number | null;

  @Field(() => Float, { nullable: true })
  temperature: number | null;

  @Field(() => PatientDashboardPressureFieldModel, { nullable: true })
  pressure: PatientDashboardPressureFieldModel | null;

  constructor(props: PatientDashboardModel) {
    Object.assign(this, props);
  }

  static create(props: PatientDashboardModel): PatientDashboardModel {
    return new PatientDashboardModel(props);
  }
}
