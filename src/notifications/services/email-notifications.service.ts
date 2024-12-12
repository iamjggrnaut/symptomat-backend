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
