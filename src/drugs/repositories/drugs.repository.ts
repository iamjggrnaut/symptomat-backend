import { postgresCyrillicRegex } from 'src/utils/regex';
import { EntityRepository, Repository } from 'typeorm';

import { Drug } from '../entities';

@EntityRepository(Drug)
export class DrugsRepository extends Repository<Drug> {
  search(filter?: string, options?: { startAtCyrillic?: boolean }): Promise<Drug[]> {
    const qb = this.createQueryBuilder(Drug.tableName).orderBy('name', 'ASC');

    if (options.startAtCyrillic != undefined) {
      qb.where(
        `${Drug.tableName}."name" ${options.startAtCyrillic ? '' : 'NOT'} SIMILAR TO '${postgresCyrillicRegex}'`,
      );
    }

    if (filter) {
      qb.andWhere('drugs.name ILIKE(:filter)', { filter: `%${filter}%` });
    }

    return qb.getMany();
  }

  findByName(name: string): Promise<Drug> {
    return this.findOne({
      where: {
        name,
      },
    });
  }
}
