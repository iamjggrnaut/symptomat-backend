import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mailgun from 'mailgun-js';

import { EmailNotificationsService } from './services';

@Module({
  imports: [],
  providers: [
    EmailNotificationsService,
    {
      provide: 'MAILGUN',
      useFactory: (configService: ConfigService) => {
        return Mailgun.default({
          apiKey: configService.get<string>('mailgun.apiKey'),
          domain: configService.get<string>('mailgun.domain'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmailNotificationsService],
})
export class NotificationsModule {}
