import { ObjectType } from '@nestjs/graphql';
import { EntityPayload } from 'src/common/payloads/base/entity-payload';

@ObjectType()
export class InvalidVerificationEmailPasswordProblem extends EntityPayload.BaseProblem {
  constructor(message = 'Неверный пароль') {
    super(message);
  }
}

@ObjectType()
export class InvalidVerificationEmailHashProblem extends EntityPayload.BaseProblem {
  constructor(message = 'Invalid link') {
    super(message);
  }
}
