import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PatientWeightHistoryItemModel {
  @Field(() => Float)
  value: number;

  @Field(() => Date)
  createdAt: Date;

  private constructor(data: PatientWeightHistoryItemModel) {
    Object.assign(this, data);
  }

  static create(props: PatientWeightHistoryItemModel): PatientWeightHistoryItemModel {
    return new PatientWeightHistoryItemModel(props);
  }
}
