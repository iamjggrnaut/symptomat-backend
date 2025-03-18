import crypto from 'crypto';

import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseProblem } from 'src/common/payloads';
import { HospitalManagersRepository } from 'src/hospital-managers/repository/hospital-managers.repository';
import { HospitalsDoctorsRepository, HospitalsRepository } from 'src/hospitals/repositories';

import { BaseAuthService } from '../../auth/auth.types';
import {
  ExistEmailProblem,
  InvalidVerificationEmailHashProblem,
  NotExistEmailProblem,
  PasswordRecoveryLinkExpiredProblem,
  SignUpLinkExpiredProblem,
  TooManyRequestsProblem,
} from '../../common/problems';
import { UsersAuthService } from '../../common/services/users-auth.service';
import { Doctor } from '../entities';
import { DoctorEmailPasswordRecoveryInput } from '../inputs/doctor-email-password-recovery.input';
import { DoctorEmailSignUpInput } from '../inputs/doctor-email-signup.input';
import { DoctorEmailUpdateInput } from '../inputs/doctor-email-update.input';
import { DoctorInvitationsRepository, DoctorRepository } from '../repositories';
import { DoctorEmailNotificationService } from './doctor-email-notification.service';

@Injectable()
export class DoctorEmailAuthService implements BaseAuthService.DoctorAuthService<BaseAuthService.AuthProvider.EMAIL> {
  private isDebug: boolean;

  constructor(
    private readonly doctorRepository: DoctorRepository,
    private readonly doctorInvitationsRepository: DoctorInvitationsRepository,
    private readonly userAuthService: UsersAuthService,
    private readonly doctorNotificationService: DoctorEmailNotificationService,
    private readonly hospitalsDoctorsRepository: HospitalsDoctorsRepository,
    private readonly hospitalsRepository: HospitalsRepository,
    private readonly hospitalManagersRepository: HospitalManagersRepository,
    readonly configService: ConfigService,
    @InjectRepository(DoctorRepository)
    private readonly repository: DoctorRepository,
  ) {
    const env = configService.get<string>('environment');
    this.isDebug = ['development', 'staging'].includes(env);
  }

  async signIn({ email, password }: BaseAuthService.UserEmailSigninInput): Promise<BaseAuthService.AuthDoctor> {
    const doctor = await this.repository.findByCredentials(email, password);

    if (!doctor) {
      throw new BadRequestException('Неверная почта или пароль');
    }

    const { token, refreshToken } = await this.userAuthService.createAuthTokensOrFail(doctor);

    return {
      user: doctor,
      token,
      refreshToken,
    };
  }

  async sendSignUpLink(hospitalManagerId: string, email: string): Promise<string | undefined> {
    const doctor = await this.doctorRepository.findOne({
      where: { email },
    });
    if (doctor) {
      throw new BadRequestException(`Doctor with email ${doctor.email} already exists!`);
    }
    const { hospitalId } = await this.hospitalManagersRepository.findOne(hospitalManagerId);
    const { hash } = await this.doctorNotificationService.sendSignUpLink(hospitalId, email);

    await this.doctorInvitationsRepository.upsert({ email, hospitalId });

    return this.isDebug ? hash : undefined;
  }

  async doctorSelfSignUpLink(email: string): Promise<string | undefined> {
    const doctor = await this.doctorRepository.findOne({
      where: { email },
    });
    if (doctor) {
      throw new BadRequestException(`Doctor with email ${doctor.email} already exists!`);
    }
    const hospitalId = '52eab7b8-148c-432e-a2f9-c8c65aeeb3e5';

    await this.doctorInvitationsRepository.upsert({ email, hospitalId });

    return this.isDebug ? hospitalId : undefined;
  }

  async sendPasswordRecoveryLink(email: string): Promise<string | undefined> {
    const doctor = await this.repository.findOne({
      email,
    });

    if (!doctor) {
      throw new BadRequestException('Doctor with such email not found');
    }

    const { hash } = await this.doctorNotificationService.sendRecoveryPasswordLink(email);

    return this.isDebug ? hash : undefined;
  }

  async signUp(input: DoctorEmailSignUpInput) {
    const { hash, password } = input;

    const doctorEmailRecord = await this.doctorNotificationService.getEmailRecordByHash(hash);
    if (!doctorEmailRecord) {
      throw new SignUpLinkExpiredProblem();
    }

    const { email, hospitalId } = doctorEmailRecord;
    const existedDoctor = await this.doctorRepository.findOne({
      where: { email },
      select: ['id'],
    });
    if (existedDoctor !== undefined) {
      throw new BaseProblem('Doctor already exists');
    }

    const hospital = await this.hospitalsRepository.findOne(hospitalId);
    if (hospital === undefined) {
      throw new BaseProblem('Hospital does not exists');
    }

    const doctor = await this.doctorRepository.save(
      this.doctorRepository.create({
        email,
        password,
      }),
    );
    await this.hospitalsDoctorsRepository.save({
      hospitalId,
      doctorId: doctor.id,
    });
    await this.doctorInvitationsRepository.removeDoctorInvitation(doctor.email);

    const { token, refreshToken } = await this.userAuthService.createAuthTokensOrFail(doctor);
    await this.doctorNotificationService.deleteEmailRecordByHash(hash);

    return {
      user: doctor,
      token,
      refreshToken,
    };
  }

  async recoverPassword(input: DoctorEmailPasswordRecoveryInput): Promise<boolean> {
    const { hash } = input;
    const password = crypto.createHmac('sha256', input.password).digest('hex');

    const doctorEmailRecord = await this.doctorNotificationService.getPasswordRecoveryEmailRecordByHash(hash);
    if (!doctorEmailRecord) {
      throw new PasswordRecoveryLinkExpiredProblem();
    }

    const { email } = doctorEmailRecord;
    const doctor = await this.doctorRepository.findOne({
      where: { email },
    });

    this.doctorRepository.update(doctor.id, { password });
    this.doctorNotificationService.deleteEmailRecordByHash(hash);

    return true;
  }

  async emailRecoveryPasswordSendLink(email: string) {
    const doctor = await this.repository.findOne({ email });

    if (!doctor) {
      throw new NotExistEmailProblem();
    }

    try {
      const { hash } = await this.doctorNotificationService.emailRecoveryPasswordSendLink(email);
      return {
        hash: this.isDebug ? hash : undefined,
      };
    } catch (error) {
      if (error?.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new TooManyRequestsProblem(error.message);
      } else {
        throw error;
      }
    }
  }

  async changeEmailSendLink(email: string) {
    const doctor = await this.repository.findOne({ email });

    if (!!doctor) {
      throw new ExistEmailProblem();
    }

    try {
      const { hash } = await this.doctorNotificationService.changeEmailSendLink(email);
      return {
        hash: this.isDebug ? hash : undefined,
      };
    } catch (error) {
      if (error?.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new TooManyRequestsProblem(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateEmail(doctor: Doctor, input: DoctorEmailUpdateInput) {
    try {
      await this.doctorNotificationService.checkChangeEmail(input.email, input.hash);
    } catch (error) {
      throw new InvalidVerificationEmailHashProblem(error.message);
    }

    doctor = this.repository.create(doctor);
    doctor.email = input.email;
    await this.repository.save(doctor);

    const { token, refreshToken } = await this.userAuthService.createAuthTokensOrFail(doctor);

    return {
      user: doctor,
      token,
      refreshToken,
    };
  }
}
