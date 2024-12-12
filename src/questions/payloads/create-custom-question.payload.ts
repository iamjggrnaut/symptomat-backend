import { Field, ObjectType } from '@nestjs/graphql';
import { BasePayload } from 'src/common/payloads/base/base-payload';

import { EmailSignUpSendCodeProblem, ExistEmailProblem, TooManyRequestsProblem } from '../../common/problems';
import { QuestionModel } from '../models';

@ObjectType()
export class CreateCustomQuestionPayload implements BasePayload {
  @Field(() => EmailSignUpSendCodeProblem, { nullable: true })
  problem?: ExistEmailProblem | TooManyRequestsProblem;

  @Field(() => QuestionModel, {
    nullable: true,
  })
  question?: Parameters<typeof QuestionModel.create>[0];

  static create(props: Partial<CreateCustomQuestionPayload>) {
    const payload = new CreateCustomQuestionPayload();
    Object.assign(payload, props);
    return payload;
  }
}
