import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudCacheStorageService } from '@purrweb/cloud-cache-storage';
import { makePatientRecoverPasswordTemplate } from 'src/notifications/email-templates/patient-recover-password-template';
import { EmailNotificationsService } from 'src/notifications/services';
import { generateVerificationCode } from 'src/utils';

type PasswordRecoveryEmailRecord = {
  code: string;
  email: string;
  expDate: string;
};

type PasswordRecoveryEmailRecordPayload = {
  code: string;
  email: string;
};

@Injectable()
export class PatientEmailNotificationService {
  constructor(
    private readonly emailNotificationService: EmailNotificationsService,
    private readonly cacheStorageService: CloudCacheStorageService,
    readonly configService: ConfigService,
  ) {}

  async sendRecoveryPasswordCode(email: string): Promise<PasswordRecoveryEmailRecord> {
    const codeLength = 4;
    const code = generateVerificationCode(codeLength);

    const applicationName = this.configService.get<string>('applicationName');
    const recoveryCode = `${code}`;
    const template = makePatientRecoverPasswordTemplate({
      applicationName,
      supportEmail: this.configService.get<string>('mailgun.supportEmail'),
      recoveryCode,
    });
    await this.emailNotificationService.sendWithTemplate({ email, template, subject: `Восстановление доступа` });

    return this.setEmailRecordForPasswordRecovery({ code, email });
  }

  private setEmailRecordForPasswordRecovery({
    code,
    email,
  }: PasswordRecoveryEmailRecordPayload): PasswordRecoveryEmailRecord {
    const dayInSec = 60 * 60 * 24;
    const { expDate } = this.cacheStorageService.setValueWithExp(email, { email, code }, dayInSec);

    return {
      email,
      code,
      expDate,
    };
  }

  public getPasswordRecoveryEmailRecordByEmail(email: string): Promise<PasswordRecoveryEmailRecord> {
    return this.cacheStorageService.getValue(email);
  }

  public deleteEmailRecordByEmail(email: string): Promise<boolean> {
    return this.cacheStorageService.deleteValue(email);
  }
}
