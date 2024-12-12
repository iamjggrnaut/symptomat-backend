import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import {
  GOOGLE_AUTH_OPTIONS_PROVIDER_NAME,
  GoogleAuthModuleModuleAsyncOptions,
  GoogleAuthModuleOptionsFactory,
} from './google-auth-mobile.types';
import { GoogleAuthService, GoogleOAuthClientService } from './services';

@Module({
  providers: [GoogleAuthService, GoogleOAuthClientService],
  exports: [GoogleAuthService],
})
export class GoogleAuthMobileModule {
  static forRootAsync(options: GoogleAuthModuleModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: GoogleAuthMobileModule,
      imports: options.imports,
      providers: [...asyncProviders, GoogleAuthService, GoogleOAuthClientService],
      exports: [GoogleAuthService, GoogleOAuthClientService],
    };
  }

  private static createAsyncProviders(options: GoogleAuthModuleModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<GoogleAuthModuleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: GoogleAuthModuleModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: GOOGLE_AUTH_OPTIONS_PROVIDER_NAME,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [options.useClass as Type<GoogleAuthModuleOptionsFactory>];

    return {
      provide: GOOGLE_AUTH_OPTIONS_PROVIDER_NAME,
      useFactory: async (optionsFactory: GoogleAuthModuleOptionsFactory) =>
        await optionsFactory.createGoogleAuthModuleOptions(),
      inject,
    };
  }
}
