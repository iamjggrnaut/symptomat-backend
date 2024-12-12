import { BadRequestException } from '@nestjs/common';
import { SearchOrder } from 'src/common/types/users.types';
import { EntityRepository, Repository } from 'typeorm';

import { PatientAnalyzes } from '../entities/patient-analyzes.entity';

@EntityRepository(PatientAnalyzes)
export class PatientAnalyzesRepository extends Repository<PatientAnalyzes> {
  async findManyByCriteria({
    orderBy,
    patientId,
    take,
    startAt,
    endAt,
    last,
  }: {
    orderBy: SearchOrder;
    patientId: string;
    take: number;
    startAt?: Date;
    endAt?: Date;
    last?: Pick<PatientAnalyzes, 'id' | 'createdAt'>;
  }): Promise<PatientAnalyzes[]> {
    const qb = this.createQueryBuilder('pa').where('pa."patientId" = :patientId', { patientId });
    if (last) {
      qb.andWhere(
        `(pa."createdAt"::timestamp(2) ${orderBy === SearchOrder.ASC ? '>' : '<'} :lastCreatedAt::timestamp(2))
         OR (
                pa."createdAt"::timestamp(2) = :lastCreatedAt::timestamp(2) and
                pa."id" > :lastId
            )`,
        {
          lastCreatedAt: last.createdAt,
          lastId: last.id,
        },
      );
    }
    if (startAt || endAt) {
      if (!endAt) {
        throw new BadRequestException('"endAt" required if "startAt" exists');
      }

      if (!startAt) {
        throw new BadRequestException('"startAt" required if "endAt" exists');
      }

      qb.andWhere(/*sql*/ `(pa."createdAt"::date BETWEEN :startAt AND :endAt)`, {
        startAt,
        endAt,
      });
    }

    return qb.orderBy('pa."createdAt"', orderBy).addOrderBy('pa."id"', 'ASC').limit(take).getMany();
  }
}
