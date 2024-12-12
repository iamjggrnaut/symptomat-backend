import { ObjectType } from '@nestjs/graphql';
import { EntityPayload } from 'src/common/payloads/base/entity-payload';

@ObjectType()
export class TooManyRequestsProblem extends EntityPayload.BaseProblem {
  constructor(message = 'too many requests') {
    super(message);
  }
}
