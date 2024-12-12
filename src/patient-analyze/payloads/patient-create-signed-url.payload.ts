import { Field, ObjectType } from '@nestjs/graphql';
import { pickObject } from 'src/utils/pick-object';

@ObjectType()
export class PatientCreateSignedUrlPayload {
  constructor(data: Partial<PatientCreateSignedUrlPayload>) {
    Object.assign(this, data);
  }

  static create(props: Partial<PatientCreateSignedUrlPayload>) {
    return new PatientCreateSignedUrlPayload(pickObject({ ...props }, ['signedUrl', 'fileKey']));
  }

  @Field(() => String)
  signedUrl: string;

  @Field(() => String)
  fileKey: string;
}
