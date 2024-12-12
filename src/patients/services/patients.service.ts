import crypto from 'crypto';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PatientDoctorContactRequestEvent } from 'src/common/events';
import { PATIENT_DOCTOR_CONTACT_REQUEST_EVENT } from 'src/common/events/events.types';
import { NotExistPatientProblem } from 'src/common/problems';
import { DoctorsPatientsRepository } from 'src/doctors/repositories';
import { HospitalPatientModel } from 'src/hospitals/models';
import { HospitalsDoctorsRepository, HospitalsPatientsRepository } from 'src/hospitals/repositories';
import { QuestionType } from 'src/questions/questions.types';
import { SurveyAnswersRepository } from 'src/surveys/repositories';
import { cursorToData, dataToCursor } from 'src/utils/base64';

import { PasswordsNotMatchProblem } from '../../common/problems/passwords-not-match.problem';
import { UsersAuthService } from '../../common/services/users-auth.service';
import { Patient } from '../entities';
import { PatientFcmTokenUpdateInput } from '../inputs';
import { PatientDashboardModel } from '../models/patient-dashboard.model';
import { PatientCursor, PressureCursor, PulseCursor, TemperatureCursor, WeightCursor } from '../patient-cursors.types';
import { PatientsRepository } from '../repositories/patients.repository';

@Injectable()
export class PatientsService {
  constructor(
    private readonly userAuthService: UsersAuthService,
    private readonly patientsRepository: PatientsRepository,
    private readonly doctorsPatientsRepository: DoctorsPatientsRepository,
    private readonly surveyAnswersRepository: SurveyAnswersRepository,
    private readonly hospitalsPatientsRepository: HospitalsPatientsRepository,
    private readonly hospitalsDoctorsRepository: HospitalsDoctorsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findOne(patientId: string) {
    return this.patientsRepository.findOne(patientId);
  }

  async updatePassword(patientId: string, oldPassword: string, newPassword: string) {
    const patient = await this.patientsRepository.findOne({
      id: patientId,
      password: crypto.createHmac('sha256', oldPassword).digest('hex'),
    });

    if (!patient) {
      throw new PasswordsNotMatchProblem();
    }

    patient.password = newPassword;
    await this.patientsRepository.save(patient);

    const { token, refreshToken } = await this.userAuthService.createAuthTokensOrFail(patient);

    return {
      user: patient,
      token,
      refreshToken,
    };
  }

  async removePatient(patientId: string): Promise<boolean> {
    try {
      const doctorPatient = await this.doctorsPatientsRepository.findOneOrFail({
        where: {
          patientId: patientId,
        },
      });
      await this.doctorsPatientsRepository.remove(doctorPatient);
      return true;
    } catch {
      throw new NotFoundException('patient not found');
    }
  }

  async assignToDoctor(doctorId: string, patientId: string): Promise<boolean> {
    const patient = await this.patientsRepository.findOne({
      id: patientId,
    });

    if (!patient) {
      throw new NotFoundException('patient not found');
    }

    const assignedPatient = await this.doctorsPatientsRepository.findOne({
      where: {
        patientId: patientId,
      },
    });

    if (assignedPatient) {
      throw new BadRequestException('patient already assigned to doctor');
    }
    await this.doctorsPatientsRepository.save({
      patientId: patientId,
      doctorId: doctorId,
    });
    return true;
  }

  async updateOne(patientId: string, dto: Partial<Patient>): Promise<Patient> {
    try {
      const patient = await this.patientsRepository.findOneOrFail(patientId);
      return await this.patientsRepository.save({ ...patient, ...dto });
    } catch {
      throw new NotExistPatientProblem();
    }
  }

  async emailIsUniq(email: string): Promise<boolean> {
    const patient = await this.patientsRepository.findOneActualPatient({
      where: {
        email: email.toLowerCase(),
      },
      select: ['id'],
    });
    return !patient;
  }

  async medicalCardNumberIsUniq(medicalCardNumber: string, hospitalId: string): Promise<boolean> {
    const patientInHospital = await this.hospitalsPatientsRepository.findOneActualHospitalPatient({
      where: { hospitalId, medicalCardNumber },
      select: ['id'],
    });
    return !patientInHospital;
  }

  async patchFcmToken(patientId: string, input: PatientFcmTokenUpdateInput): Promise<Patient> {
    await this.patientsRepository.update(patientId, {
      fcmToken: input.fcmToken,
    });
    return this.patientsRepository.findOne(patientId);
  }

  async getPatientDoctors(patientId: string) {
    return this.doctorsPatientsRepository.find({
      where: { patientId },
    });
  }

  async getDashboard(patientId: string): Promise<PatientDashboardModel> {
    const getLastSurveyAnswer = (questionType: QuestionType) => {
      const qb = this.surveyAnswersRepository.createQueryBuilderByPatientIdAndQuestionType(patientId, questionType);

      return qb.getOne();
    };

    const weight = await getLastSurveyAnswer(QuestionType.WEIGHT).then((surveyAnswer) => {
      return surveyAnswer?.answerValue[QuestionType.WEIGHT]?.value || null;
    });

    const pulse = await getLastSurveyAnswer(QuestionType.PULSE).then((surveyAnswer) => {
      return surveyAnswer?.answerValue[QuestionType.PULSE].value || null;
    });

    const temperature = await getLastSurveyAnswer(QuestionType.TEMPERATURE).then((surveyAnswer) => {
      return surveyAnswer?.answerValue[QuestionType.TEMPERATURE].value || null;
    });

    const pressure = await getLastSurveyAnswer(QuestionType.PRESSURE).then((surveyAnswer) => {
      return surveyAnswer?.answerValue[QuestionType.PRESSURE] || null;
    });

    return {
      weight,
      pulse,
      temperature,
      pressure,
    };
  }

  async getWeightHistory({
    patientId,
    first = 4,
    after,
    startAt,
    endAt,
  }: {
    patientId: string;
    first: number;
    after?: string;
    startAt?: Date;
    endAt?: Date;
  }) {
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }

    const cursor: WeightCursor | null = after != null ? cursorToData<WeightCursor>(after) : null;
    const currentTake = cursor ? cursor.take : first + 1;
    const currentStartAt = cursor ? cursor.startAt : startAt;
    const currentEndAt = cursor ? cursor.endAt : endAt;

    const surveyAnswers = await this.surveyAnswersRepository
      .createQueryBuilderByPatientIdAndQuestionTypeWithPagination({
        patientId,
        questionType: QuestionType.WEIGHT,
        startAt: currentStartAt,
        endAt: currentEndAt,
        take: currentTake,
        last: cursor?.lastWeight,
      })
      .getMany();

    let newCursor: WeightCursor;
    if (surveyAnswers.length > 2) {
      newCursor = {
        take: currentTake,
        startAt: currentStartAt,
        endAt: currentEndAt,
        lastWeight: {
          createdAt: surveyAnswers[surveyAnswers.length - 2].createdAt,
        },
      };
    }

    const hasNextPage = surveyAnswers.length > currentTake - 1;
    const nodes = hasNextPage ? surveyAnswers.slice(0, -1) : surveyAnswers;
    return {
      nodes: nodes.map(({ answerValue, createdAt }) => ({
        createdAt,
        value: answerValue[QuestionType.WEIGHT].value,
      })),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<WeightCursor>(newCursor) : null,
      },
    };
  }

  async getPulseHistory({
    patientId,
    first = 4,
    after,
    startAt,
    endAt,
  }: {
    patientId: string;
    first: number;
    after?: string;
    startAt?: Date;
    endAt?: Date;
  }) {
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }

    const cursor: PulseCursor | null = after != null ? cursorToData<PulseCursor>(after) : null;
    const currentTake = cursor ? cursor.take : first + 1;
    const currentStartAt = cursor ? cursor.startAt : startAt;
    const currentEndAt = cursor ? cursor.endAt : endAt;

    const surveyAnswers = await this.surveyAnswersRepository
      .createQueryBuilderByPatientIdAndQuestionTypeWithPagination({
        patientId,
        questionType: QuestionType.PULSE,
        startAt: currentStartAt,
        endAt: currentEndAt,
        take: currentTake,
        last: cursor?.lastPulse,
      })
      .getMany();

    let newCursor: PulseCursor;
    if (surveyAnswers.length > 2) {
      newCursor = {
        take: currentTake,
        startAt: currentStartAt,
        endAt: currentEndAt,
        lastPulse: {
          createdAt: surveyAnswers[surveyAnswers.length - 2].createdAt,
        },
      };
    }

    const hasNextPage = surveyAnswers.length > currentTake - 1;
    const nodes = hasNextPage ? surveyAnswers.slice(0, -1) : surveyAnswers;
    return {
      nodes: nodes.map(({ answerValue, createdAt }) => ({
        createdAt,
        value: answerValue[QuestionType.PULSE].value,
      })),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<PulseCursor>(newCursor) : null,
      },
    };
  }

  async getTemperatureHistory({
    patientId,
    first = 4,
    after,
    startAt,
    endAt,
  }: {
    patientId: string;
    first: number;
    after?: string;
    startAt?: Date;
    endAt?: Date;
  }) {
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }

    const cursor: TemperatureCursor | null = after != null ? cursorToData<TemperatureCursor>(after) : null;
    const currentTake = cursor ? cursor.take : first + 1;
    const currentStartAt = cursor ? cursor.startAt : startAt;
    const currentEndAt = cursor ? cursor.endAt : endAt;

    const surveyAnswers = await this.surveyAnswersRepository
      .createQueryBuilderByPatientIdAndQuestionTypeWithPagination({
        patientId,
        questionType: QuestionType.TEMPERATURE,
        startAt: currentStartAt,
        endAt: currentEndAt,
        take: currentTake,
        last: cursor?.lastTemperature,
      })
      .getMany();

    let newCursor: TemperatureCursor;
    if (surveyAnswers.length > 2) {
      newCursor = {
        take: currentTake,
        startAt: currentStartAt,
        endAt: currentEndAt,
        lastTemperature: {
          createdAt: surveyAnswers[surveyAnswers.length - 2].createdAt,
        },
      };
    }

    const hasNextPage = surveyAnswers.length > currentTake - 1;
    const nodes = hasNextPage ? surveyAnswers.slice(0, -1) : surveyAnswers;
    return {
      nodes: nodes.map(({ answerValue, createdAt }) => ({
        createdAt,
        value: answerValue[QuestionType.TEMPERATURE].value,
      })),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<TemperatureCursor>(newCursor) : null,
      },
    };
  }

  async getPressureHistory({
    patientId,
    first = 4,
    after,
    startAt,
    endAt,
  }: {
    patientId: string;
    first: number;
    after?: string;
    startAt?: Date;
    endAt?: Date;
  }) {
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }

    const cursor: PressureCursor | null = after != null ? cursorToData<PressureCursor>(after) : null;
    const currentTake = cursor ? cursor.take : first + 1;
    const currentStartAt = cursor ? cursor.startAt : startAt;
    const currentEndAt = cursor ? cursor.endAt : endAt;

    const surveyAnswers = await this.surveyAnswersRepository
      .createQueryBuilderByPatientIdAndQuestionTypeWithPagination({
        patientId,
        questionType: QuestionType.PRESSURE,
        startAt: currentStartAt,
        endAt: currentEndAt,
        take: currentTake,
        last: cursor?.lastPressure,
      })
      .getMany();

    let newCursor: PressureCursor;
    if (surveyAnswers.length > 2) {
      newCursor = {
        take: currentTake,
        startAt: currentStartAt,
        endAt: currentEndAt,
        lastPressure: {
          createdAt: surveyAnswers[surveyAnswers.length - 2].createdAt,
        },
      };
    }

    const hasNextPage = surveyAnswers.length > currentTake - 1;
    const nodes = hasNextPage ? surveyAnswers.slice(0, -1) : surveyAnswers;
    return {
      nodes: nodes.map(({ answerValue, createdAt }) => ({
        createdAt,
        upperValue: answerValue[QuestionType.PRESSURE].upperValue,
        lowerValue: answerValue[QuestionType.PRESSURE].lowerValue,
      })),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<PressureCursor>(newCursor) : null,
      },
    };
  }

  async searchPatient({
    doctorId,
    first = 4,
    after,
    filter,
  }: {
    doctorId: string;
    first: number;
    after?: string;
    filter?: string;
  }) {
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }

    const { hospitalId } = await this.hospitalsDoctorsRepository.findOne({
      doctorId,
    });
    const cursor: PatientCursor | null = after != null ? cursorToData<PatientCursor>(after) : null;
    const currentTake = cursor ? cursor.take : first + 1;

    const hospitalPatients = await this.hospitalsPatientsRepository.findManyByCriteria({
      filter,
      take: currentTake,
      hospitalId,
      lastPatient: cursor?.lastPatient,
      doctorId,
    });

    let newCursor: PatientCursor;
    if (hospitalPatients.length > 2) {
      newCursor = {
        take: currentTake,
        lastPatient: {
          rowNumber: hospitalPatients[hospitalPatients.length - 2].rowNumber,
        },
      };
    }

    const hasNextPage = hospitalPatients.length > currentTake - 1;
    return {
      nodes: hasNextPage
        ? hospitalPatients.slice(0, -1).map((hospitalPatients) => HospitalPatientModel.create(hospitalPatients))
        : hospitalPatients.map((hospitalPatients) => HospitalPatientModel.create(hospitalPatients)),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<PatientCursor>(newCursor) : null,
      },
    };
  }

  async sendContactMeRequest(patientId: string, doctorId: string, message: string) {
    const doctorPatient = await this.doctorsPatientsRepository.findOne({
      where: {
        patientId,
        doctorId,
      },
    });
    if (!doctorPatient) {
      throw new BadRequestException("It's not your doctor!");
    }
    this.eventEmitter.emit(
      PATIENT_DOCTOR_CONTACT_REQUEST_EVENT,
      new PatientDoctorContactRequestEvent({
        patientId,
        doctorId,
        message,
      }),
    );

    return true;
  }
}
