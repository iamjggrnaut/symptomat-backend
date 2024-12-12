import { EntityRepository, Repository } from 'typeorm';

import { HospitalsDoctors } from '../entities';

@EntityRepository(HospitalsDoctors)
export class HospitalsDoctorsRepository extends Repository<HospitalsDoctors> {}
