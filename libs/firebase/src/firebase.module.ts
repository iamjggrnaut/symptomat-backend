import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import { FIREBASE_OPTIONS_PROVIDER_NAME, FirebaseModuleAsyncOptions, FirebaseOptionsFactory } from './firebase.types';
import { FirebaseService, PushNotificationsService } from './services';

@Module({})
export class FirebaseModule {
  static forRootAsync(options: FirebaseModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: FirebaseModule,
      imports: options.imports,
      providers: [...asyncProviders, FirebaseService, PushNotificationsService],
      exports: [FirebaseService, PushNotificationsService],
    };
  }

  private static createAsyncProviders(options: FirebaseModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<FirebaseOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: FirebaseModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: FIREBASE_OPTIONS_PROVIDER_NAME,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [options.useClass as Type<FirebaseOptionsFactory>];

    return {
      provide: FIREBASE_OPTIONS_PROVIDER_NAME,
      useFactory: async (optionsFactory: FirebaseOptionsFactory) => await optionsFactory.createOptions(),
      inject,
    };
  }
}
