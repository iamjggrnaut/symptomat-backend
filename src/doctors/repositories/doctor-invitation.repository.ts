import { SearchOrder } from 'src/common/types/users.types';
import { Hospital } from 'src/hospitals/entities';
import { EntityRepository, Repository } from 'typeorm';

import { CreateDoctorInvitationDto } from '../dtos';
import { DoctorInvitation } from '../entities';

@EntityRepository(DoctorInvitation)
export class DoctorInvitationsRepository extends Repository<DoctorInvitation> {
  async removeDoctorInvitation(email: string) {
    const invite = await this.findOne({ where: { email } });
    return this.delete(invite.id);
  }

  async findManyByCriteria({
    orderBy,
    take,
    filter,
    lastDoctor,
    hospitalId,
  }: {
    orderBy: SearchOrder;
    take: number;
    filter?: string;
    lastDoctor?: Pick<DoctorInvitation, 'id' | 'createdAt'>;
    hospitalId: Hospital['id'];
  }): Promise<DoctorInvitation[]> {
    const { tableName } = DoctorInvitation;
    const qb = this.createQueryBuilder(tableName).where(`${tableName}."hospitalId" = :hospitalId`, { hospitalId });
    if (lastDoctor) {
      qb.andWhere(
        `(${tableName}."createdAt"::timestamp(2) ${
          orderBy === SearchOrder.ASC ? '>' : '<'
        } :lastCreatedAt::timestamp(2)) OR (
          ${tableName}."createdAt"::timestamp(2) = :lastCreatedAt::timestamp(2) and
          ${tableName}."id" > :lastId
        )`,
        {
          lastCreatedAt: lastDoctor.createdAt,
          lastId: lastDoctor.id,
        },
      );
    }
    if (filter) {
      qb.andWhere(`${tableName}."email" ILIKE '%' || :filter || '%'`, { filter });
    }

    return qb.orderBy(`${tableName}."createdAt"`, orderBy).limit(take).getMany();
  }

  async upsert(data: CreateDoctorInvitationDto) {
    await this.createQueryBuilder()
      .insert()
      .into(DoctorInvitation)
      .values(data)
      .onConflict(`("email") DO NOTHING`)
      .execute();
  }
}
