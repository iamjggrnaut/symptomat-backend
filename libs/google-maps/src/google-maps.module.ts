import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import {
  GOOGLE_MAPS_OPTIONS_PROVIDER_NAME,
  GoogleMapsModuleAsyncOptions,
  GoogleMapsOptionsFactory,
} from './google-maps.types';
import { GoogleMapsService } from './services';

@Module({})
export class GoogleMapsModule {
  static forRootAsync(options: GoogleMapsModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: GoogleMapsModule,
      imports: options.imports,
      providers: [...asyncProviders, GoogleMapsService],
      exports: [GoogleMapsService],
    };
  }

  private static createAsyncProviders(options: GoogleMapsModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<GoogleMapsOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: GoogleMapsModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: GOOGLE_MAPS_OPTIONS_PROVIDER_NAME,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [options.useClass as Type<GoogleMapsOptionsFactory>];

    return {
      provide: GOOGLE_MAPS_OPTIONS_PROVIDER_NAME,
      useFactory: async (optionsFactory: GoogleMapsOptionsFactory) => await optionsFactory.createOptions(),
      inject,
    };
  }
}
