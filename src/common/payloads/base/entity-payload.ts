import { Field, ObjectType } from '@nestjs/graphql';

import { BaseProblem } from './base-problem';
import { BasePayload } from '..';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EntityPayload {
  export interface IPayload<Record> {
    recordId?: string;
    record?: Record;
    problem?: BaseProblem;
  }
}

export abstract class EntityPayload {
  public static BaseProblem = BaseProblem;

  /**
   * @example
   * // usual case
   * await EntityPayload.catchProblems(MyPayload, () => {
   *   return MyPayload.create({...data});
   * }); // MyPayload { record: {...data} }
   * // error case
   * await EntityPayload.catchProblems(MyPayload, () => {
   *   throw new MyPayload.SomeProblem();
   * }); // MyPayload { errors: [MyPayload.SomeProblem] }
   */
  public static async catchProblems<Payload extends EntityPayload.IPayload<any>>(
    PayloadClass: new () => Payload,
    handler: () => Promise<Payload> | Payload,
  ) {
    try {
      const payload = await handler();
      payload.recordId = payload?.record?.id;

      return payload;
    } catch (err) {
      const payload = new PayloadClass();
      payload.problem = EntityPayload.mapToPromlems(err);
      return payload;
    }
  }

  private static mapToPromlems(err: any): BaseProblem {
    if (err instanceof EntityPayload.BaseProblem) {
      return err;
    }

    throw err;
  }

  /**
   * @example
   * const MyPayload = EntityPayload.buildPayload(MyPayloadRecord, 'MyPayload');
   * // class MyPayload { recordId?: string; record?: MyPayloadRecord; errors?: EntityPayload.IBaseProblem[]; }
   *
   * // with custom errors
   * /@ObjectType()
   * export class PATIENTror extends EntityPayload.BaseProblem {
   *   /@Field(() => String)
   *   description: string;
   * }
   *
   * /@ObjectType()
   * export class MyPayload extends EntityPayload.buildPayload(MyPayloadRecord, 'MyPayload') {
   *   /@Field(() => [PATIENTror])
   *   errors?: PATIENTror[];
   * }
   */
  public static buildPayload<RecordClassType extends new (...args: any[]) => any>(
    RecordClass: RecordClassType,
    name: string,
  ) {
    type Record = InstanceType<RecordClassType>;

    @ObjectType(name)
    class Payload extends BasePayload implements EntityPayload.IPayload<Record> {
      public problem?: BaseProblem;

      @Field(() => String, { nullable: true })
      public recordId?: string;

      @Field(() => RecordClass, { nullable: true })
      public record?: Record;

      constructor(record?: Record) {
        super();
        this.record = record;
      }

      static create(...args: ConstructorParameters<RecordClassType>): Payload {
        return new Payload(new RecordClass(...args));
      }
    }

    return Payload;
  }
}
