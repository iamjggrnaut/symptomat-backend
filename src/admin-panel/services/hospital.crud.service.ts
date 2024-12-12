import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import { QuerySortOperator } from '@nestjsx/crud-request';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DoctorRepository } from 'src/doctors/repositories';

import { Hospital } from '../../hospitals/entities';
import { HospitalsPatientsRepository, HospitalsRepository } from '../../hospitals/repositories';
import { HospitalResponseDto } from '../dtos';

@Injectable()
export class HospitalsCrudService extends TypeOrmCrudService<Hospital> {
  constructor(
    readonly repository: HospitalsRepository,
    readonly hospitalsPatientsRepository: HospitalsPatientsRepository,
    readonly doctorRepository: DoctorRepository,
  ) {
    super(repository);
  }

  async getOneHospitalById(crudRequest: CrudRequest): Promise<HospitalResponseDto> {
    const hospital = await this.getOne(crudRequest);
    return this.getHospitalWithPatientData(hospital);
  }

  async getManyHospitalsWithLimit(
    crudRequest: CrudRequest,
  ): Promise<GetManyDefaultResponse<HospitalResponseDto> | HospitalResponseDto[]> {
    const patientsCountOrder = crudRequest.parsed.sort.find((sort) => sort.field === 'patientsCount')?.order;
    if (patientsCountOrder) {
      crudRequest.parsed.sort = crudRequest.parsed.sort.filter((sort) => sort.field !== 'patientsCount');
    }
    const hospitalsResult = await this.getMany(crudRequest);
    if (Array.isArray(hospitalsResult)) {
      return this.getHospitalWithPatientArray(hospitalsResult as Hospital[], patientsCountOrder);
    }

    const hospitalPaginated = hospitalsResult as GetManyDefaultResponse<HospitalResponseDto>;
    hospitalPaginated.data = await this.getHospitalWithPatientArray(hospitalPaginated.data, patientsCountOrder);
    return hospitalPaginated;
  }

  async deleteOneHospital(crudRequest: CrudRequest) {
    const hospitalId = crudRequest.parsed.paramsFilter.find((param) => param.field === 'id')?.value;
    if (!hospitalId) {
      throw new BadRequestException('Hospital id not found');
    }

    const hospital = await this.repository.findOne(hospitalId, { relations: ['hospitalDoctors'], select: ['id'] });
    const doctorIds = hospital.hospitalDoctors.map((hd) => hd.doctorId);
    if (doctorIds?.length) {
      await this.doctorRepository.delete(doctorIds);
    }

    return this.deleteOne(crudRequest);
  }

  private async getHospitalWithPatientArray(
    hospitals: Hospital[],
    patientsCountOrder: QuerySortOperator | undefined,
  ): Promise<HospitalResponseDto[]> {
    return Promise.all(hospitals.map(async (hospital) => this.getHospitalWithPatientData(hospital))).then((res) =>
      res.sort((firstHospital, secondHospital) => {
        if (!patientsCountOrder) {
          return 0;
        }
        if (patientsCountOrder === 'ASC') {
          return firstHospital.patientsCount - secondHospital.patientsCount;
        }
        if (patientsCountOrder === 'DESC') {
          return secondHospital.patientsCount - firstHospital.patientsCount;
        }
      }),
    );
  }

  private async getHospitalWithPatientData(hospital: Hospital): Promise<HospitalResponseDto> {
    const hospitalsPatients = await this.hospitalsPatientsRepository.find({
      relations: ['patient'],
      where: { hospitalId: hospital.id },
    });
    const patients = hospitalsPatients.map((elem) => elem?.patient);
    const patientsCount = patients.filter((patientInfo) => patientInfo?.isFirstSignUp === false).length;
    const invitationPatientsCount = patients.filter(
      (patientInfo) => patientInfo?.isFirstSignUp === true && patientInfo?.inviteEndAt > new Date(),
    ).length;
    return { ...hospital, patientsCount, invitationPatientsCount };
  }
}
