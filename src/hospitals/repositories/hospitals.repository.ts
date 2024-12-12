import { EntityRepository, Repository } from 'typeorm';

import { Hospital } from '../entities/hospital.entity';

@EntityRepository(Hospital)
export class HospitalsRepository extends Repository<Hospital> {
  async getHospitalByDoctorsIds(doctorIds: string[]) {
    const hospitals = await this.createQueryBuilder('h')
      .where('h."deletedAt" IS NULL')
      .andWhere('hd.doctorId IN (:...doctorIds)', { doctorIds })
      .innerJoinAndSelect(`h.hospitalDoctors`, 'hd')
      .getMany();
    return doctorIds.map((doctorId) => hospitals.find((h) => h.hospitalDoctors.find((hd) => hd.doctorId === doctorId)));
  }
}
