import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { HospitalManager } from '../../hospital-managers/entities/hospital-managers.entity';
import { HospitalManagersRepository } from '../../hospital-managers/repository/hospital-managers.repository';

@Injectable()
export class HospitalManagersCrudService extends TypeOrmCrudService<HospitalManager> {
  constructor(readonly repository: HospitalManagersRepository) {
    super(repository);
  }
}
