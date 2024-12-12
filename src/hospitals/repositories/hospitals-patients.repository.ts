import _ from 'lodash';
import { DoctorPatient } from 'src/doctors/entities';
import { Patient } from 'src/patients/entities';
import { DeepPartial, EntityRepository, FindOneOptions, Repository, SelectQueryBuilder, getConnection } from 'typeorm';

import { HospitalPatient } from '../entities';

export type HospitalPatientType = {
  id: string;
  patientId: string;
  hospitalId: string;
  medicalCardNumber: string;
  firstName: string;
  lastName: string;
  doctorId: string | null;
  createdAt: Date;
  rowNumber: number;
};

@EntityRepository(HospitalPatient)
export class HospitalsPatientsRepository extends Repository<HospitalPatient> {
  async loadPatientsHospitals(patientsIds: string[]) {
    const hospitalsPatients = await this.createQueryBuilder('hospitals_patients')
      .where('hospitals_patients."patientId" IN (:...patientsIds)', { patientsIds })
      .getMany();

    const hospitalsPatientsGroups = _.groupBy(hospitalsPatients, (patientHospital) => patientHospital.patientId);
    return patientsIds.map((patientId) => hospitalsPatientsGroups[patientId]);
  }

  async findManyByCriteria({
    hospitalId,
    take,
    filter,
    lastPatient,
    doctorId,
  }: {
    hospitalId: string;
    take: number;
    filter?: string;
    lastPatient?: Pick<HospitalPatientType, 'rowNumber'>;
    doctorId: string;
  }): Promise<HospitalPatientType[]> {
    const connection = getConnection();
    const hospitalPatients = this.createQueryBuilder(`${HospitalPatient.tableName}`)
      .select(`${HospitalPatient.tableName}.*`)
      .addSelect(`${DoctorPatient.tableName}.doctorId`, 'doctorId')
      .addSelect(
        'ROW_NUMBER () OVER (ORDER BY "doctorId", "lastName", "firstName", "medicalCardNumber" ASC)',
        'rowNumber',
      )
      .leftJoin(
        `${DoctorPatient.tableName}`,
        'doctors_patients',
        'hospitals_patients.patientId = doctors_patients.patientId',
      )
      .leftJoin(`${Patient.tableName}`, 'patients', 'hospitals_patients.patientId = patients.id')
      .where(
        `(doctors_patients.doctorId = :doctorId OR doctors_patients.doctorId IS NULL) AND
        (
          CONCAT(hospitals_patients.firstName, ' ', hospitals_patients.lastName) ILIKE :filter
          OR hospitals_patients.medicalCardNumber LIKE :filter
        )
        AND hospitals_patients.hospitalId = :hospitalId
        `,
        {
          doctorId,
          filter: `%${filter}%`,
          hospitalId,
        },
      )
      .andWhere('(patients."isFirstSignUp" = FALSE OR patients."inviteEndAt"::date >= NOW()::date)');

    if (lastPatient) {
      const qb = connection
        .createQueryBuilder()
        .select('*')
        .from(`(${hospitalPatients.getQuery()})`, 'sub')
        .setParameters(hospitalPatients.getParameters());
      qb.andWhere(
        `
        "rowNumber" > :lastPatientRowNumber
        `,
        {
          lastPatientRowNumber: lastPatient.rowNumber,
        },
      );
      return qb.limit(take).getRawMany() as Promise<HospitalPatientType[]>;
    }
    return hospitalPatients.limit(take).getRawMany() as Promise<HospitalPatientType[]>;
  }
  async upsert(hospitalPatient: DeepPartial<HospitalPatient>) {
    await this.createQueryBuilder()
      .insert()
      .into(HospitalPatient)
      .values(hospitalPatient)
      .onConflict(`("patientId", "hospitalId") DO NOTHING`)
      .execute();
  }

  async findOneActualHospitalPatient(findOptions?: FindOneOptions<HospitalPatient>): Promise<HospitalPatient> {
    return this.actualHospitalPatientQB(findOptions).getOne();
  }

  async findManyActualHospitalPatient(findOptions?: FindOneOptions<HospitalPatient>): Promise<HospitalPatient[]> {
    return this.actualHospitalPatientQB(findOptions).getMany();
  }

  async countActualHospitalPatient(findOptions?: FindOneOptions<HospitalPatient>) {
    return this.actualHospitalPatientQB(findOptions).getCount();
  }

  private actualHospitalPatientQB(findOptions?: FindOneOptions<HospitalPatient>): SelectQueryBuilder<HospitalPatient> {
    const qb = this.createQueryBuilder('hospital_patient')
      .leftJoin(`${Patient.tableName}`, 'patients', 'patients."id" = hospital_patient."patientId"')
      .where('(patients."inviteEndAt"::date >= NOW()::date OR patients."isFirstSignUp" = false)');
    if (findOptions.where['hospitalId']) {
      qb.andWhere(`hospital_patient."hospitalId" = :hospitalId`, { hospitalId: findOptions.where['hospitalId'] });
    }
    if (findOptions.where['medicalCardNumber'] !== undefined) {
      qb.andWhere(`hospital_patient."medicalCardNumber" = :medicalCardNumber`, {
        medicalCardNumber: findOptions.where['medicalCardNumber'],
      });
    }
    if (findOptions.where['patientId']) {
      qb.andWhere(`hospital_patient."patientId" = :patientId`, { patientId: findOptions.where['patientId'] });
    }
    if (findOptions.select) {
      qb.select(findOptions.select.map((field) => `hospital_patient.${field}`));
    }
    return qb;
  }
}
