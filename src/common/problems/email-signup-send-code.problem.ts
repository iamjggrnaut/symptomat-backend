import { createUnionType } from '@nestjs/graphql';

import { ExistEmailProblem, TooManyRequestsProblem } from '.';

export const EmailSignUpSendCodeProblem = createUnionType({
  name: 'EmailSignUpSendCodeProblemUnion',
  types: () => [ExistEmailProblem, TooManyRequestsProblem],
});
