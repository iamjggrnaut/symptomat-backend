import crypto from 'crypto';

import { DeepPartial, EntityRepository, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';

import { Patient } from '../entities/patient.entity';

@EntityRepository(Patient)
export class PatientsRepository extends Repository<Patient> {
  async saveWithEmptyProfile(patient: DeepPartial<Patient>): Promise<Patient> {
    return this.upsert(patient);
  }

  async findByCredentials(email: string, password: string) {
    return this.findOne({
      email: email.toLowerCase(),
      password: crypto.createHmac('sha256', password).digest('hex'),
    });
  }

  async findByEmail(email: string, options?: FindOneOptions<Patient>): Promise<Patient> {
    return this.findOne({ email }, options);
  }

  async upsert(patient: DeepPartial<Patient>): Promise<Patient> {
    const foundPatient = await this.findByEmail(patient.email, { select: ['id'] });
    if (foundPatient) {
      patient.id = foundPatient.id;
    }
    const savingPatient = this.create({ ...patient });
    return this.save(savingPatient);
  }

  async findOneActualPatient(findOptions?: FindOneOptions<Patient>): Promise<Patient> {
    return this.findActualPatientQB(findOptions).getOne();
  }

  async findManyActualPatient(findOptions?: FindOneOptions<Patient>): Promise<Patient[]> {
    return this.findActualPatientQB(findOptions).getMany();
  }

  private findActualPatientQB(findOptions?: FindOneOptions<Patient>): SelectQueryBuilder<Patient> {
    const qb = this.createQueryBuilder('patients').where(
      '(patients."inviteEndAt"::date >= NOW()::date OR patients."isFirstSignUp" = false)',
    );
    if (findOptions.where['email']) {
      qb.andWhere(`patients."email" = :email`, { email: findOptions.where['email'] });
    }
    if (findOptions.select) {
      qb.select(findOptions.select.map((field) => `patients.${field}`));
    }
    return qb;
  }
}
