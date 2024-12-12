import { Field, ObjectType } from '@nestjs/graphql';

import { Drug } from '../entities';

@ObjectType()
export class DrugModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  protected constructor(data: Partial<Drug>) {
    Object.assign(this, data);
  }

  static create(props: Drug): DrugModel {
    return new DrugModel(props);
  }
}
