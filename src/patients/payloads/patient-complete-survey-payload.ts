import { Field, ObjectType } from '@nestjs/graphql';
import { BaseProblem } from 'src/common/payloads';
import { BasePayload } from 'src/common/payloads/base/base-payload';

@ObjectType()
export class PatientCompleteSurveyPayload extends BasePayload {
  @Field(() => BaseProblem, { nullable: true })
  problem?: BaseProblem;

  @Field(() => Boolean, { nullable: true })
  success?: true;

  static create(props: Partial<PatientCompleteSurveyPayload>) {
    const payload = new PatientCompleteSurveyPayload();
    Object.assign(payload, props);

    return payload;
  }
}
