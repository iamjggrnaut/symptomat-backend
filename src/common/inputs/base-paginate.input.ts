import { Field, InputType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class BasePaginateInput {
  @Field(() => Number, { defaultValue: 10 })
  @IsInt()
  limit: number;

  @Field(() => Number, { defaultValue: 1 })
  @IsInt()
  page: number;
}
