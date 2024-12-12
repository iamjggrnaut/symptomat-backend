import { ModuleMetadata, Type } from '@nestjs/common';

export const MAILER_OPTIONS_PROVIDER_NAME = 'TRANSPORT';

export interface MailerModuleOptions {
  smtp: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
    secure: boolean;
  };
  senderEmail: string;
}

export interface MailerOptionsFactory {
  createOptions(): Promise<MailerModuleOptions> | MailerModuleOptions;
}

export interface MailerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<MailerModuleOptions> | MailerModuleOptions;
  useClass?: Type<MailerOptionsFactory>;
  inject?: any[];
}
