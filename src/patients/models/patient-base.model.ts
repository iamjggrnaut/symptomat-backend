import { ObjectType } from '@nestjs/graphql';

import { UsersModelBase } from '../../common/models/users.model';

@ObjectType()
export abstract class PatientModelBase extends UsersModelBase {
  protected constructor(data: Partial<PatientModelBase>) {
    super(data);
    Object.assign(this, data);
  }
}
