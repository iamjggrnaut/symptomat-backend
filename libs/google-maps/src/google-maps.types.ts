import { ModuleMetadata, Type } from '@nestjs/common';

export const GOOGLE_MAPS_OPTIONS_PROVIDER_NAME = 'GOOGLE_MAPS';

export interface GoogleMapsModuleOptions {
  key: string;
}

export interface GoogleMapsOptionsFactory {
  createOptions(): Promise<GoogleMapsModuleOptions> | GoogleMapsModuleOptions;
}

export interface GoogleMapsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<GoogleMapsModuleOptions> | GoogleMapsModuleOptions;
  useClass?: Type<GoogleMapsOptionsFactory>;
  inject?: any[];
}
