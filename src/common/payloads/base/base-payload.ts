import { Field, ObjectType } from '@nestjs/graphql';

import { BaseProblem } from './base-problem';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BasePayload {
  export interface IPayload {
    problem?: BaseProblem;
  }
}

@ObjectType()
export abstract class BasePayload {
  public static BaseProblem = BaseProblem;

  @Field(() => BaseProblem, { nullable: true })
  problem?: BaseProblem;

  /**
   * @example
   * // usual case
   * await BasePayload.catchProblems(MyPayload, () => {
   *   return MyPayload.create({...data});
   * }); // MyPayload { record: {...data} }
   * // error case
   * await BasePayload.catchProblems(MyPayload, () => {
   *   throw new MyPayload.SomeProblem();
   * }); // MyPayload { errors: [MyPayload.SomeProblem] }
   */
  public static async catchProblems<Payload extends BasePayload.IPayload>(
    PayloadClass: new (...args: any[]) => Payload,
    handler: () => Promise<Payload> | Payload,
  ) {
    try {
      const payload = await handler();
      return payload;
    } catch (err) {
      const payload = new PayloadClass();
      payload.problem = BasePayload.mapToPromlems(err);
      return payload;
    }
  }

  private static mapToPromlems(err: any): BaseProblem {
    if (err instanceof BasePayload.BaseProblem) {
      return err;
    }

    throw err;
  }
}
