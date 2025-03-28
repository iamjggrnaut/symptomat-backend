import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationHttpClient } from './notification.http.client';

@Module({
  imports: [HttpModule.register({})],
  providers: [NotificationHttpClient],
  exports: [NotificationHttpClient],
})
export class TelegramModule {}