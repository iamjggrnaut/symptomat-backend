import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { makeHospitalManagerSignUpTemplate } from 'src/notifications/email-templates/hospital-manager-sign-up-template';
import { EmailNotificationsService } from 'src/notifications/services';

import { BaseAuthService } from '../../auth/auth.types';
import { UsersAuthService } from '../../common/services/users-auth.service';
import { PASSWORD_LENGTH } from '../../common/types/notification.types';
import { generatePassword } from '../../utils/generate-verification-code';
import { CreateHospitalManagerDto } from '../dto/hospital-manager.dto';
import { HospitalManagersRepository } from '../repository/hospital-managers.repository';

@Injectable()
export class HospitalManagerEmailAuthService
  implements BaseAuthService.ManagerAuthService<BaseAuthService.AuthProvider.EMAIL> {
  constructor(
    private readonly repository: HospitalManagersRepository,
    private readonly userAuthService: UsersAuthService,
    readonly configService: ConfigService,
    private readonly emailNotificationService: EmailNotificationsService,
  ) {}

  async signIn({ email, password }: BaseAuthService.UserEmailSigninInput): Promise<BaseAuthService.AuthManager> {
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

  async sendCodeForSignup(
    props: CreateHospitalManagerDto,
  ): Promise<{
    id: string;
    email: string;
    hospitalId: string;
    password: string;
  }> {
    const { email, hospitalId } = props;
    const user = await this.repository.findOne({
      email,
    });
    if (user) {
      throw new BadRequestException('Manager with this email already exists');
    }
    try {
      const password = generatePassword(PASSWORD_LENGTH);

      const manager = await this.repository.create({
        email,
        password,
        hospitalId,
      });
      const applicationName = this.configService.get<string>('applicationName');
      const template = makeHospitalManagerSignUpTemplate({
        applicationName,
        supportEmail: this.configService.get<string>('mailgun.supportEmail'),
        password,
        signInLink: this.configService.get<string>('links.frontendManagerSignInLink'),
      });
      await this.emailNotificationService.sendWithTemplate({
        email,
        template,
        subject: `Благодарим за регистрацию в ${applicationName}`,
      });
      await this.repository.save(manager);
      return {
        id: manager.id,
        email: manager.email,
        hospitalId: manager.hospitalId,
        password,
      };
    } catch (error) {
      if (error?.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }
}
