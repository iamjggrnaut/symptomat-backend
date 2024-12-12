import { ModuleMetadata, Type } from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';

export const FIREBASE_OPTIONS_PROVIDER_NAME = 'FIREBASE';

export interface FirebaseModuleOptions {
  serviceAccountPathOrObject: string | ServiceAccount;
  debug?: boolean;
}

export interface FirebaseOptionsFactory {
  createOptions(): Promise<FirebaseModuleOptions> | FirebaseModuleOptions;
}

export interface FirebaseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<FirebaseModuleOptions> | FirebaseModuleOptions;
  useClass?: Type<FirebaseOptionsFactory>;
  inject?: any[];
}
