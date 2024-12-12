import { ObjectType } from '@nestjs/graphql';

import { UsersModelBase } from '../../common/models/users.model';
import { pickObject } from '../../utils/pick-object';
import { HospitalManager } from '../entities/hospital-managers.entity';

@ObjectType()
export class MeHospitalManagerModel extends UsersModelBase {
  private constructor(data: Partial<MeHospitalManagerModel>) {
    super(data);
  }

  static create(props: HospitalManager) {
    return new MeHospitalManagerModel({
      ...pickObject(props, ['id', 'email', 'createdAt', 'deletedAt', 'updatedAt', 'role']),
    });
  }
}
