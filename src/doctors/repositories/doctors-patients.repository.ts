import { Patient } from 'src/patients/entities';
import { DeepPartial, EntityRepository, Repository } from 'typeorm';

import { DoctorPatient } from '../entities';

@EntityRepository(DoctorPatient)
export class DoctorsPatientsRepository extends Repository<DoctorPatient> {
  async findInviteCount(doctorId: string): Promise<number> {
    const qb = this.createQueryBuilder('doctors_patients')
      .where('doctors_patients."doctorId" = :doctorId', { doctorId })
      .leftJoinAndSelect(`${Patient.tableName}`, 'patients', 'patients."id" = doctors_patients."patientId"')
      .andWhere('patients."isFirstSignUp" = true')
      .andWhere('patients."inviteEndAt"::date >= NOW()::date');
    return qb.getCount();
  }

  async removePatientById(patientId: string) {
    return this.createQueryBuilder('doctors_patients')
      .where('doctors_patients."patientId" = :patientId', { patientId })
      .delete()
      .execute();
  }

  async upsert(doctorPatient: DeepPartial<DoctorPatient>) {
    await this.createQueryBuilder()
      .insert()
      .into(DoctorPatient)
      .values(doctorPatient)
      .onConflict(`("patientId") DO NOTHING`)
      .execute();
  }
}
