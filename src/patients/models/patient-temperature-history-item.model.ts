import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PatientTemperatureHistoryItemModel {
  @Field(() => Float)
  value: number;

  @Field(() => Date)
  createdAt: Date;

  private constructor(data: PatientTemperatureHistoryItemModel) {
    Object.assign(this, data);
  }

  static create(props: PatientTemperatureHistoryItemModel): PatientTemperatureHistoryItemModel {
    return new PatientTemperatureHistoryItemModel(props);
  }
}
