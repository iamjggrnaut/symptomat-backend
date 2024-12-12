import crypto from 'crypto';

import { EntityRepository, Repository } from 'typeorm';

import { HospitalManager } from '../entities/hospital-managers.entity';

@EntityRepository(HospitalManager)
export class HospitalManagersRepository extends Repository<HospitalManager> {
  async findByCredentials(email: string, password: string) {
    return this.findOne({
      email: email.toLowerCase(),
      password: crypto.createHmac('sha256', password).digest('hex'),
    });
  }
}
