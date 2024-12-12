import { ObjectType } from '@nestjs/graphql';

import { EntityPayload } from '../payloads';

@ObjectType()
export class SignUpLinkExpiredProblem extends EntityPayload.BaseProblem {
  constructor(message = 'Sign up link expired') {
    super(message);
  }
}

@ObjectType()
export class PasswordRecoveryLinkExpiredProblem extends EntityPayload.BaseProblem {
  constructor(message = 'Password recovery link expired') {
    super(message);
  }
}

@ObjectType()
export class PasswordRecoveryCodeExpiredProblem extends EntityPayload.BaseProblem {
  constructor(message = 'Password recovery code expired') {
    super(message);
  }
}
