import { Inject, Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { MAILER_OPTIONS_PROVIDER_NAME, MailerModuleOptions } from '../mailer.types';

@Injectable()
export class MailerService {
  private _client: Transporter;

  constructor(
    @Inject(MAILER_OPTIONS_PROVIDER_NAME)
    private readonly options: MailerModuleOptions,
  ) {
    this._client = this.createClientFromOptions();
  }

  async sendMail<T>(mailOptions: Mail.Options, from = this.options.senderEmail): Promise<T> {
    return this._client.sendMail({ ...mailOptions, from });
  }

  private createClientFromOptions(): Transporter {
    return nodemailer.createTransport(this.options.smtp);
  }

  get client() {
    return this._client;
  }
}
