import { ModuleMetadata, Type } from '@nestjs/common';
import { TokenPayload } from 'google-auth-library';

export interface GoogleUser extends TokenPayload {
  email: string;
}

export const GOOGLE_AUTH_OPTIONS_PROVIDER_NAME = 'GOOGLE_AUTH_MOBILE';

export declare type GoogleAuthModuleOptions = {
  clientId: string;
  clientSecret: string;
  iosClientId: string;
  androidClientId: string;
};

export interface GoogleAuthModuleOptionsFactory {
  createGoogleAuthModuleOptions(): Promise<GoogleAuthModuleOptions> | GoogleAuthModuleOptions;
}

export interface GoogleAuthModuleModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<GoogleAuthModuleOptions> | GoogleAuthModuleOptions;
  useClass?: Type<GoogleAuthModuleOptionsFactory>;
  inject?: any[];
}
