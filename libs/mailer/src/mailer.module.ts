import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import { MAILER_OPTIONS_PROVIDER_NAME, MailerModuleAsyncOptions, MailerOptionsFactory } from './mailer.types';
import { MailerService } from './services/mailer.service';

@Module({})
export class MailerModule {
  static forRootAsync(options: MailerModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: MailerModule,
      imports: options.imports,
      providers: [...asyncProviders, MailerService],
      exports: [MailerService],
    };
  }

  private static createAsyncProviders(options: MailerModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<MailerOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: MailerModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: MAILER_OPTIONS_PROVIDER_NAME,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [options.useClass as Type<MailerOptionsFactory>];

    return {
      provide: MAILER_OPTIONS_PROVIDER_NAME,
      useFactory: async (optionsFactory: MailerOptionsFactory) => await optionsFactory.createOptions(),
      inject,
    };
  }
}
