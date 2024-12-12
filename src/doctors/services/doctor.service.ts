import crypto from 'crypto';

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotExistDoctorProblem, PasswordsNotMatchProblem } from 'src/common/problems';
import { UsersAuthService } from 'src/common/services/users-auth.service';
import { SearchOrder } from 'src/common/types/users.types';
import { HospitalsDoctorsRepository, HospitalsPatientsRepository } from 'src/hospitals/repositories';
import { PatientsRepository } from 'src/patients/repositories';
import { cursorToData, dataToCursor } from 'src/utils/base64';

import { Doctor } from '../entities';
import { DoctorInvitationModel } from '../models';
import { DoctorConnection } from '../models/doctor-connection';
import { DoctorInvitationsRepository, DoctorRepository, DoctorsPatientsRepository } from '../repositories';

export interface DoctorCursor {
  orderBy: SearchOrder;
  filter?: string;
  take: number;
  hospitalId: string;
  lastDoctor?: Pick<Doctor, 'id' | 'createdAt'>;
}

@Injectable()
export class DoctorService {
  constructor(
    private readonly doctorRepository: DoctorRepository,
    private readonly doctorInvitationsRepository: DoctorInvitationsRepository,
    private readonly patientsRepository: PatientsRepository,
    private readonly doctorsPatientsRepository: DoctorsPatientsRepository,
    private readonly hospitalsPatientsRepository: HospitalsPatientsRepository,
    private readonly hospitalsDoctorsRepository: HospitalsDoctorsRepository,
    private readonly userAuthService: UsersAuthService,
  ) {}

  async findOne(id: string) {
    return this.doctorRepository.findOne(id);
  }

  async emailIsUniq(email: string): Promise<boolean> {
    const doctor = await this.doctorRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
      select: ['id'],
    });
    return !doctor;
  }

  async removeDoctorById(doctorId: string): Promise<boolean> {
    try {
      const doctor = await this.doctorRepository.findOneOrFail(doctorId);
      await this.doctorRepository.remove(doctor);
      return true;
    } catch {
      throw new NotFoundException('doctor not found');
    }
  }

  async updateOne(doctorId: string, dto: Partial<Doctor>): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepository.findOneOrFail(doctorId);
      return await this.doctorRepository.save({ ...doctor, ...dto });
    } catch {
      throw new NotExistDoctorProblem();
    }
  }

  async searchDoctors({
    hospitalId,
    orderBy = SearchOrder.DESC,
    first = 20,
    after,
    filter,
  }: {
    hospitalId: string;
    orderBy?: SearchOrder;
    first: number;
    after?: string;
    filter?: string;
  }): Promise<DoctorConnection> {
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }
    const cursor: DoctorCursor | null = after != null ? cursorToData<DoctorCursor>(after) : null;
    const currentHospitalId = cursor ? cursor.hospitalId : hospitalId;
    const currentFilter = cursor ? cursor.filter : filter;
    const currentOrderBy = cursor ? cursor.orderBy : orderBy;
    const currentTake = cursor ? cursor.take : first + 1;

    const acceptedDoctors = await this.doctorRepository.findManyByCriteria({
      orderBy: currentOrderBy,
      take: currentTake,
      filter: currentFilter,
      hospitalId: currentHospitalId,
      lastDoctor: cursor?.lastDoctor,
    });
    const doctors: DoctorInvitationModel[] = acceptedDoctors.map((doctor) => {
      const doctorInvitationModel = DoctorInvitationModel.create(doctor);
      doctorInvitationModel.isInviteAccepted = true;
      return doctorInvitationModel;
    });
    const invitedDoctors = await this.doctorInvitationsRepository.findManyByCriteria({
      hospitalId: currentHospitalId,
      orderBy: currentOrderBy,
      take: currentTake,
      filter: currentFilter,
      lastDoctor: cursor?.lastDoctor,
    });
    doctors.push(
      ...invitedDoctors.map((invitedDoctor) => {
        const doctor = new Doctor();
        doctor.email = invitedDoctor.email;
        const doctorInvitationModel = DoctorInvitationModel.create(doctor);
        doctorInvitationModel.isInviteAccepted = false;
        return doctorInvitationModel;
      }),
    );

    let newCursor: DoctorCursor;
    if (doctors.length > 2) {
      newCursor = {
        orderBy: currentOrderBy,
        filter: currentFilter,
        take: currentTake,
        hospitalId: currentHospitalId,
        lastDoctor: {
          id: doctors[doctors.length - 2].id,
          createdAt: doctors[doctors.length - 2].createdAt,
        },
      };
    }
    const hasNextPage = doctors.length > currentTake - 1;
    return {
      nodes: hasNextPage
        ? doctors.slice(0, -1).map((doctor, index) => {
            const doctorInvitationModel = DoctorInvitationModel.create(doctor as Doctor);
            //uniq id need to front-end
            doctorInvitationModel.id = String(index);
            doctorInvitationModel.isInviteAccepted = doctor.isInviteAccepted;
            return doctorInvitationModel;
          })
        : doctors.map((doctor, index) => {
            const doctorInvitationModel = DoctorInvitationModel.create(doctor as Doctor);
            //uniq id need to front-end
            doctorInvitationModel.id = String(index);
            doctorInvitationModel.isInviteAccepted = doctor.isInviteAccepted;
            return doctorInvitationModel;
          }),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<DoctorCursor>(newCursor) : null,
      },
    };
  }

  // TODO: move to hospital-patients.query.resolver
  async findHospitalPatient(doctorId: string, patientId: string) {
    // TODO: move hospitalId to parameters
    const doctorHospital = await this.hospitalsDoctorsRepository.findOne({
      where: { doctorId },
    });
    if (!doctorHospital) {
      throw new BadRequestException('Doctor does not included in any hospital');
    }

    const patient = await this.patientsRepository.findOne(patientId);
    if (!patient) {
      throw new NotFoundException('Patient with such id not found');
    }

    const doctorPatient = await this.doctorsPatientsRepository.findOne({
      where: {
        doctorId,
        patientId,
      },
    });
    if (!doctorPatient) {
      throw new ForbiddenException('Patient does not belongs to this doctor');
    }

    const { hospitalId } = doctorHospital;
    const hospitalPatient = await this.hospitalsPatientsRepository.findOne({
      where: {
        patientId,
        hospitalId,
      },
    });
    if (!hospitalPatient) {
      throw new ForbiddenException('Patient does not belongs to this hospital');
    }

    return { ...hospitalPatient, doctorId };
  }

  async updatePassword(doctorId: string, password: string, newPassword: string) {
    const doctor = await this.doctorRepository.findOne({
      id: doctorId,
      password: crypto.createHmac('sha256', password).digest('hex'),
    });

    if (!doctor) {
      throw new PasswordsNotMatchProblem();
    }

    doctor.password = newPassword;
    await this.doctorRepository.save(doctor);

    const { token, refreshToken } = await this.userAuthService.createAuthTokensOrFail(doctor);

    return {
      user: doctor,
      token,
      refreshToken,
    };
  }
}
