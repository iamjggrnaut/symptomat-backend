import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseProblem {
  @Field(() => String)
  public message: string;

  constructor(msg: string) {
    this.message = msg;
  }
}
