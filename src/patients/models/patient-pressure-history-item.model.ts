import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PatientPressureHistoryItemModel {
  @Field(() => Float)
  upperValue: number;

  @Field(() => Float)
  lowerValue: number;

  @Field(() => Date)
  createdAt: Date;

  private constructor(data: PatientPressureHistoryItemModel) {
    Object.assign(this, data);
  }

  static create(props: PatientPressureHistoryItemModel): PatientPressureHistoryItemModel {
    return new PatientPressureHistoryItemModel(props);
  }
}
