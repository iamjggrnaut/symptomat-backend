import { ObjectType } from '@nestjs/graphql';
import { BaseProblem } from 'src/common/payloads';

@ObjectType()
export class PasswordsNotMatchProblem extends BaseProblem {
  constructor() {
    super('Неверный пароль');
  }
}

@ObjectType()
export class CodeNotMatchProblem extends BaseProblem {
  constructor() {
    super('Невеерный код');
  }
}
