import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PatientPulseHistoryItemModel {
  @Field(() => Float)
  value: number;

  @Field(() => Date)
  createdAt: Date;

  private constructor(data: PatientPulseHistoryItemModel) {
    Object.assign(this, data);
  }

  static create(props: PatientPulseHistoryItemModel): PatientPulseHistoryItemModel {
    return new PatientPulseHistoryItemModel(props);
  }
}
