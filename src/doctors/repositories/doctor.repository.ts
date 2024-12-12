import crypto from 'crypto';

import { SearchOrder } from 'src/common/types/users.types';
import { EntityRepository, Repository } from 'typeorm';

import { Doctor } from '../entities';

@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor> {
  async findByCredentials(email: string, password: string) {
    return this.findOne({
      email: email.toLowerCase(),
      password: crypto.createHmac('sha256', password).digest('hex'),
    });
  }

  async findManyByCriteria({
    orderBy,
    hospitalId,
    take,
    filter,
    lastDoctor,
  }: {
    orderBy: SearchOrder;
    hospitalId: string;
    take: number;
    filter?: string;
    lastDoctor?: Pick<Doctor, 'id' | 'createdAt'>;
  }): Promise<Doctor[]> {
    const qb = this.createQueryBuilder('d');
    if (lastDoctor) {
      qb.where(
        `(d."createdAt"::timestamp(2) ${orderBy === SearchOrder.ASC ? '>' : '<'} :lastCreatedAt::timestamp(2)) OR (
        d."createdAt"::timestamp(2) = :lastCreatedAt::timestamp(2) and
        d."id" > :lastId
        )`,
        {
          lastCreatedAt: lastDoctor.createdAt,
          lastId: lastDoctor.id,
        },
      );
    }
    if (filter) {
      qb.andWhere(`d."email" ILIKE '%' || :filter || '%'`, { filter });
    }

    return qb
      .innerJoinAndSelect(`d.hospitalsDoctors`, 'hospitals_doctors', 'hospitals_doctors.hospitalId = :hospitalId', {
        hospitalId,
      })
      .orderBy('d."createdAt"', orderBy)
      .limit(take)
      .getMany();
  }
}
