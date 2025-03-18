import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mailgun } from 'mailgun-js';

@Injectable()
export class EmailNotificationsService {
  constructor(@Inject('MAILGUN') private readonly mailgun: Mailgun, private readonly configService: ConfigService) {}

  private MAILGUN_SENDER = 'info@' + this.configService.get<string>('mailgun.domain');

  async send(email: string, text: string, subject?: string) {
    await this.mailgun.messages().send({
      from: this.MAILGUN_SENDER,
      subject,
      to: email,
      text,
    });
  }

  async notifyPatientNewQuery(
    email: string,
    firstName: string,
    lastName: string,
    googlePlayLink: string,
    appStoreLink: string,
    applicationName: string,
    subject?: string,
  ) {
    try {
      await this.mailgun.messages().send({
        from: this.MAILGUN_SENDER,
        to: email,
        subject: subject || 'Активный опрос!',
        html: `
         <!doctype html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Активный опрос!</title>
      </head>
      <body>
        Здравствуйте, ${firstName && lastName ? firstName + ' ' + lastName : 'уважаемый пользователь'}!
        <br>
        <br>
        У Вас имеется активный опрос!
        <br>
        Пожалуйста, перейдите в приложение и заполните его. Так врач всегда будет в курсе вашего состояния.
        <br>
        <br>
        Android:
        <br>
        <ul>
        <li>
        GooglePlay: <a href="https://play.google.com/store/apps/details?id=medico.app"> Resymon - Apps on Google Play</a>
        </li>
        <li>
        RuStore: <a href="https://www.rustore.ru/catalog/app/medico.app">Resymon в каталоге RuStore @RuStore</a>
        </li>
        </ul>
        <br>
        AppStore: <a href="https://apps.apple.com/us/app/resymon/id1601949347">Resymon @App Store</a>
        <br>
        <br>
        С уважением,
        <br>
        Команда ${applicationName}
      </body>
      </html>
        `,
      });
    } catch (e) {
      throw new HttpException('Some problem with mailing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendWithTemplate({ email, template, subject }: { email: string; template: string; subject: string }) {
    try {
      await this.mailgun.messages().send({
        from: this.MAILGUN_SENDER,
        to: email,
        subject,
        html: template,
      });
    } catch (e) {
      throw new HttpException('Some problem with mailing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
