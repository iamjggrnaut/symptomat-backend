import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import {
  CLOUD_FILES_STORAGE_OPTIONS_PROVIDER_NAME,
  S3ModuleAsyncOptions,
  S3OptionsFactory,
} from './cloud-files-storage.types';
import { CloudFilesStorageService, S3Service } from './services';

@Module({})
export class CloudFilesStorageModule {
  static defaultOptions = {
    privateBucket: 'private',
    publicBucket: 'public',
    putActionExpiresSec: 300,
    getActionExpiresSec: 500,
  };

  static forRootAsync(options: S3ModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: CloudFilesStorageModule,
      imports: options.imports,
      providers: [...asyncProviders, CloudFilesStorageService, S3Service],
      exports: [CloudFilesStorageService, S3Service],
    };
  }

  private static createAsyncProviders(options: S3ModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<S3OptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: S3ModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: CLOUD_FILES_STORAGE_OPTIONS_PROVIDER_NAME,
        useFactory: { ...CloudFilesStorageModule.defaultOptions, ...options.useFactory } as any,
        inject: options.inject || [],
      };
    }

    const inject = [options.useClass as Type<S3OptionsFactory>];

    return {
      provide: CLOUD_FILES_STORAGE_OPTIONS_PROVIDER_NAME,
      useFactory: async (optionsFactory: S3OptionsFactory) => {
        const options = await optionsFactory.createS3Options();
        return { ...CloudFilesStorageModule.defaultOptions, ...options };
      },
      inject,
    };
  }
}
