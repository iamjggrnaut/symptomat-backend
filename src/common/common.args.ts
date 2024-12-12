import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetUiidArgs {
  @IsUUID()
  @Field()
  id: string;
}
