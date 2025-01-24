import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudCacheStorageService } from '@purrweb/cloud-cache-storage';
import moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { RedisHashFromLinkKey } from 'src/common/types/notification.types';
import { Language } from 'src/common/types/users.types';
import { makeContactPatientRequestTemplate } from 'src/notifications/email-templates/contact-patient-request-template';
import { makeCriticalIndicatorsTemplate } from 'src/notifications/email-templates/critical-indicators-template';
import { makeDoctorRecoverPasswordTemplate } from 'src/notifications/email-templates/doctor-recover-password-template';
import { makeDoctorSignUpTemplate } from 'src/notifications/email-templates/doctor-sign-up-template';
import { makePatientCreatedAnalyzesTemplate } from 'src/notifications/email-templates/patient-created-analyzes-template';
import { EmailNotificationsService } from 'src/notifications/services';
import { v4 as uuidv4 } from 'uuid';

type SignUpEmailRecord = {
  hash: string;
  email: string;
  expDate: string;
  hospitalId: string;
};

type SignUpEmailRecordPayload = {
  hash: string;
  email: string;
  hospitalId: string;
};

type PasswordRecoveryEmailRecord = {
  hash: string;
  email: string;
  expDate: string;
};

type PasswordRecoveryEmailRecordPayload = {
  hash: string;
  email: string;
};

@Injectable()
export class DoctorEmailNotificationService {
  constructor(
    private readonly emailNotificationService: EmailNotificationsService,
    private readonly cacheStorageService: CloudCacheStorageService,
    private readonly i18n: I18nService,
    readonly configService: ConfigService,
  ) {}

  async sendSignUpLink(hospitalId: string, email: string): Promise<SignUpEmailRecord> {
    const hash = uuidv4();

    const applicationName = this.configService.get<string>('applicationName');
    const signInLink = `https://doctor.resymon.ru/sign-up?hash=${hash}`;
    const template = makeDoctorSignUpTemplate({
      applicationName,
      supportEmail: this.configService.get<string>('mailgun.supportEmail'),
      signInLink,
    });
    await this.emailNotificationService.sendWithTemplate({
      email,
      template,
      subject: `Добро пожаловать в ${applicationName}, коллега!`,
    });

    return this.setEmailRecord({ hash, email, hospitalId });
  }

  async sendUploadAnalyzesByPatientEmail(input: {
    lang: Language;
    email: string;
    patientMedicalCardNumber: string;
    patientId: string;
  }) {
    const { lang, email, patientMedicalCardNumber, patientId } = input;

    const analyzesLink = `https://doctor.resymon.ru/patient/${patientId}/analyzes`;
    const supportEmail = this.configService.get<string>('mailgun.supportEmail');

    const template = makePatientCreatedAnalyzesTemplate({
      lang,
      patientMedicalCardNumber,
      analyzesLink,
      supportEmail,
    });

    const subject = await this.i18n.translate('doctor-email-subjects.patient-upload-analyzes');
    await this.emailNotificationService.sendWithTemplate({ email, template, subject });
  }

  async sendContactPatientRequestEmail(email: string, medicalCardNumber: string, message: string, patientId: string) {
    const patientLink = `https://doctor.resymon.ru/patient/${patientId}/1`;
    const mailgunDomain = this.configService.get<string>('mailgun.domain');
    const template = makeContactPatientRequestTemplate(medicalCardNumber, message, patientLink, mailgunDomain);
    await this.emailNotificationService.sendWithTemplate({ email, template, subject: 'Связь с пациентом' });
  }

  async sendCriticalIndicatorsEmail(email: string, medicalCardNumber: string, questionsWithAnswers, patientId: string) {
    const patientLink = `https://doctor.resymon.ru/patient/${patientId}/1`;
    const mailgunDomain = this.configService.get<string>('mailgun.domain');
    const template = makeCriticalIndicatorsTemplate(
      medicalCardNumber,
      patientLink,
      mailgunDomain,
      questionsWithAnswers,
    );
    await this.emailNotificationService.sendWithTemplate({
      email,
      template,
      subject: 'Превышение критического уровня',
    });
  }

  private setEmailRecord({ hash, email, hospitalId }: SignUpEmailRecordPayload): SignUpEmailRecord {
    const dayInSec = 60 * 60 * 24;
    const { expDate } = this.cacheStorageService.setValueWithExp(hash, { hash, email, hospitalId }, dayInSec);

    return {
      hash,
      email,
      expDate,
      hospitalId,
    };
  }

  async sendRecoveryPasswordLink(email: string): Promise<PasswordRecoveryEmailRecord> {
    const hash = uuidv4();

    const applicationName = this.configService.get<string>('applicationName');
    const recoverPasswordLink = `http://localhost:3000/recovery-password?hash=${hash}`;
    const template = makeDoctorRecoverPasswordTemplate({
      applicationName,
      supportEmail: this.configService.get<string>('mailgun.supportEmail'),
      recoverPasswordLink,
    });
    await this.emailNotificationService.sendWithTemplate({ email, template, subject: `Восстановление доступа` });

    return this.setEmailRecordForPasswordRecovery({ hash, email });
  }

  private setEmailRecordForPasswordRecovery({
    hash,
    email,
  }: PasswordRecoveryEmailRecordPayload): PasswordRecoveryEmailRecord {
    const dayInSec = 60 * 60 * 24;
    const { expDate } = this.cacheStorageService.setValueWithExp(hash, { hash, email }, dayInSec);

    return {
      hash,
      email,
      expDate,
    };
  }

  public getEmailRecordByHash(hash: string): Promise<SignUpEmailRecord> {
    return this.cacheStorageService.getValue(hash);
  }

  public getPasswordRecoveryEmailRecordByHash(hash: string): Promise<PasswordRecoveryEmailRecord> {
    return this.cacheStorageService.getValue(hash);
  }

  public deleteEmailRecordByHash(hash: string): Promise<boolean> {
    return this.cacheStorageService.deleteValue(hash);
  }

  async emailRecoveryPasswordSendLink(email: string) {
    // return this.sendLinkBase(email, RedisHashFromLinkKey.EMAIL_RECOVERY_PASSWORD_KEY);
    return { hash: email }; // TODO: implement
  }

  async changeEmailSendLink(email: string) {
    // return this.sendLinkBase(email, RedisHashFromLinkKey.CHANGE_EMAIL_KEY);
    return { hash: email }; // TODO: implement
  }

  async checkChangeEmail(email: string, hash: string) {
    return this.checkCode(hash, RedisHashFromLinkKey.CHANGE_EMAIL_KEY);
  }

  private async checkCode(email: string, hash: string) {
    const codeRecord = await this.getEmailRecordByHash(hash);

    if (codeRecord) {
      this.deleteEmailRecordByHash(hash);
    }

    if (!codeRecord || codeRecord.hash !== hash) {
      throw new Error('No match code');
    }

    const isExpired = moment(codeRecord.expDate).isBefore(moment());

    if (isExpired) {
      throw new Error('Code is expired');
    }
  }
}
