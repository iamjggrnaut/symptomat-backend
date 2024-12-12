import crypto from 'crypto';

import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAuthService } from 'src/auth/auth.types';
import { PASSWORD_LENGTH } from 'src/common/types/notification.types';
import { DoctorsPatientsRepository } from 'src/doctors/repositories';
import { HospitalsDoctorsRepository, HospitalsPatientsRepository } from 'src/hospitals/repositories';
import { makePatientSignUpTemplate } from 'src/notifications/email-templates/patient-sign-up-template';
import { EmailNotificationsService } from 'src/notifications/services';
import { PatientsRepository } from 'src/patients/repositories/patients.repository';
import { generatePassword } from 'src/utils/generate-verification-code';

import {
  CodeNotMatchProblem,
  ExistEmailProblem,
  InvalidVerificationEmailPasswordProblem,
  NotExistEmailProblem,
  NotExistPatientProblem,
  PasswordRecoveryCodeExpiredProblem,
} from '../../common/problems';
import { TooManyRequestsProblem } from '../../common/problems/too-many-requests.problem';
import { UsersAuthService } from '../../common/services/users-auth.service';
import { Patient } from '../entities/patient.entity';
import { PatientCheckRecoveryCodeInput, PatientEmailPasswordRecoveryInput } from '../inputs';
import { PatientCreateInput } from '../inputs';
import { PatientEmailNotificationService } from './patient-email-notification.service';

@Injectable()
export class PatientEmailAuthService implements BaseAuthService.PatientAuthService<BaseAuthService.AuthProvider.EMAIL> {
  private isDebug: boolean;

  private INVITE_LIFETIME = 3;

  constructor(
    private readonly userAuthService: UsersAuthService,
    readonly configService: ConfigService,
    private readonly emailNotificationService: EmailNotificationsService,
    private readonly hospitalsPatientsRepository: HospitalsPatientsRepository,
    private readonly hospitalsDoctorsRepository: HospitalsDoctorsRepository,
    private readonly patientNotificationService: PatientEmailNotificationService,
    private readonly doctorsPatientsRepository: DoctorsPatientsRepository,
    private readonly patientsRepository: PatientsRepository,

    @InjectRepository(PatientsRepository)
    private readonly repository: PatientsRepository,
  ) {
    const env = configService.get<string>('environment');
    this.isDebug = ['development', 'staging'].includes(env);
  }

  async signIn({ email, password }: BaseAuthService.UserEmailSigninInput): Promise<BaseAuthService.AuthPatient> {
    const patient = await this.repository.findByCredentials(email, password);

    if (!patient) {
      throw new BadRequestException('Неверная почта или пароль');
    }

    const { token, refreshToken } = await this.userAuthService.createAuthTokensOrFail(patient);

    return {
      user: patient,
      token,
      refreshToken,
    };
  }

  async createPatientOrFail({
    password,
    email,
  }: Pick<BaseAuthService.PatientEmailSignupSendCodeInput, 'password' | 'email'>): Promise<Patient> {
    try {
      const inviteEndAt: Date = new Date();
      inviteEndAt.setDate(inviteEndAt.getDate() + this.INVITE_LIFETIME);
      const patient = await this.repository.saveWithEmptyProfile({
        email,
        password,
        lastAuthProvider: BaseAuthService.AuthProvider.EMAIL,
        inviteEndAt,
      });

      return patient;
    } catch {
      throw new ExistEmailProblem();
    }
  }

  async sendPasswordForSignUp(doctorId: string, input: PatientCreateInput): Promise<string> {
    try {
      const { email, medicalCardNumber, firstname, lastname } = input;
      const foundPatient = await this.patientsRepository.findOneActualPatient({
        where: {
          email: email,
        },
      });
      if (foundPatient) {
        throw new BadRequestException(`User with email ${email} is already registered`);
      }

      const password = generatePassword(PASSWORD_LENGTH);
      const patient = await this.createPatientOrFail({ password, email });

      const { hospitalId } = await this.hospitalsDoctorsRepository.findOneOrFail({
        where: {
          doctorId: doctorId,
        },
      });

      await this.hospitalsPatientsRepository.upsert({
        patientId: patient.id,
        hospitalId,
        medicalCardNumber,
        firstName: firstname,
        lastName: lastname,
      });

      await this.doctorsPatientsRepository.upsert({
        patientId: patient.id,
        doctorId: doctorId,
      });

      const applicationName = this.configService.get<string>('applicationName');
      const template = makePatientSignUpTemplate({
        applicationName,
        supportEmail: this.configService.get<string>('mailgun.supportEmail'),
        password,
        appStoreLink: this.configService.get<string>('links.appStoreLink'),
        googlePlayLink: this.configService.get<string>('links.googlePlayLink'),
      });
      await this.emailNotificationService.sendWithTemplate({
        email,
        template,
        subject: `Благодарим за регистрацию в ${applicationName}`,
      });

      return this.isDebug ? password : undefined;
    } catch (error) {
      if (error?.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new TooManyRequestsProblem(error.message);
      } else {
        throw error;
      }
    }
  }

  async createPassword(patientId: string, password: string) {
    const patient = await this.repository.findOne({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      throw new NotExistPatientProblem();
    }

    patient.password = password;
    patient.isFirstSignUp = false;
    await this.patientsRepository.save(patient);
    const { token, refreshToken } = await this.userAuthService.createAuthTokensOrFail(patient);

    return {
      user: patient,
      token,
      refreshToken,
    };
  }

  async sendPasswordRecoveryCode(email: string): Promise<string | undefined> {
    const patient = await this.repository.findByEmail(email);

    if (!patient) {
      throw new BadRequestException(`Пользователь с почтой ${email} не существует`);
    }
    const { code } = await this.patientNotificationService.sendRecoveryPasswordCode(email);

    return this.isDebug ? code : undefined;
  }

  async checkRecoveryCode(input: PatientCheckRecoveryCodeInput) {
    const { email, code } = input;
    const patientEmailRecord = await this.patientNotificationService.getPasswordRecoveryEmailRecordByEmail(email);

    if (!patientEmailRecord) {
      throw new PasswordRecoveryCodeExpiredProblem();
    }
    if (patientEmailRecord.code != code) {
      throw new CodeNotMatchProblem();
    }
    return true;
  }

  async recoverPassword(input: PatientEmailPasswordRecoveryInput): Promise<boolean> {
    const { code, email } = input;
    const password = crypto.createHmac('sha256', input.password).digest('hex');

    const patientEmailRecord = await this.patientNotificationService.getPasswordRecoveryEmailRecordByEmail(email);
    if (!patientEmailRecord) {
      throw new PasswordRecoveryCodeExpiredProblem();
    }
    if (patientEmailRecord.code != code) {
      throw new CodeNotMatchProblem();
    }

    const doctor = await this.patientsRepository.findOne({
      where: { email },
    });

    this.patientsRepository.update(doctor.id, { password });
    this.patientNotificationService.deleteEmailRecordByEmail(email);

    return true;
  }

  async changePassword(email: string, oldPassword: string, newPassword: string) {
    const patient = await this.repository.findByCredentials(email, oldPassword);

    if (!patient) {
      throw new InvalidVerificationEmailPasswordProblem();
    }
    await this.repository.save(
      this.repository.create({
        password: newPassword,
        ...patient,
      }),
    );
    const token = await this.userAuthService.createAuthTokensOrFail(patient);

    return {
      user: patient,
      token,
    };
  }

  async emailRecoveryPasswordSendCode(email: string) {
    const patient = await this.repository.findOne({ email });

    if (!patient) {
      throw new NotExistEmailProblem();
    }

    try {
      const newPassword = generatePassword(PASSWORD_LENGTH);
      await this.repository.save({
        password: newPassword,
        ...patient,
      });
      // const emailMessage = `password: ${newPassword}`;
      // await this.emailNotificationService.send(email, emailMessage);
      return {
        password: this.isDebug ? newPassword : undefined,
      };
    } catch (error) {
      if (error?.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new TooManyRequestsProblem(error.message);
      } else {
        throw error;
      }
    }
  }

  async changeEmail(email: string, newEmail: string) {
    const patient = await this.repository.findOne({ email });

    if (!!patient) {
      throw new ExistEmailProblem();
    }

    try {
      await this.repository.save({
        email: newEmail,
        ...patient,
      });
      const { token, refreshToken } = await this.userAuthService.createAuthTokensOrFail(patient);

      return {
        user: patient,
        token,
        refreshToken,
      };
    } catch (error) {
      if (error?.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new TooManyRequestsProblem(error.message);
      } else {
        throw error;
      }
    }
  }
}
