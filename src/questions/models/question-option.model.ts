import { Field, Int, ObjectType } from '@nestjs/graphql';

import { QuestionOption } from '../entities';

@ObjectType()
export class QuestionOptionModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  text: string;

  @Field(() => Int)
  index: number;

  protected constructor(data: Partial<QuestionOption>) {
    Object.assign(this, data);
  }

  static create(props: QuestionOption): QuestionOptionModel {
    return new QuestionOptionModel(props);
  }
}
