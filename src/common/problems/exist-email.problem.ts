import { ObjectType } from '@nestjs/graphql';

import { EntityPayload } from '../payloads';

@ObjectType()
export class ExistEmailProblem extends EntityPayload.BaseProblem {
  constructor(message = 'exists email') {
    super(message);
  }
}
