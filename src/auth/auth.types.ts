import { Patient } from 'src/patients/entities/patient.entity';

import { UsersRole } from '../common/types/users.types';
import { Doctor } from '../doctors/entities';
import { HospitalManager } from '../hospital-managers/entities/hospital-managers.entity';
import { TOKEN_TYPE } from './auth.enums';

export type AuthToken = string;
export type AuthRefreshToken = string;

export interface pairOfTokens {
  token: AuthToken;
  refreshToken: AuthRefreshToken;
}

export interface JwtPayload {
  id: string;
  tokenType: TOKEN_TYPE;
  expiration: Date;
}

export interface AuthUser {
  id: string;
  role: UsersRole;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BaseAuthService {
  export enum AuthProvider {
    EMAIL = 'email',
  }

  export type AuthDoctor = {
    user: Doctor;
    token: AuthToken;
    refreshToken: AuthRefreshToken;
  };

  export type AuthPatient = {
    user: Patient;
    token: AuthToken;
    refreshToken: AuthRefreshToken;
  };

  export type AuthManager = {
    user: HospitalManager;
    token: AuthToken;
    refreshToken: AuthRefreshToken;
  };

  export type UserEmailSigninInput = {
    email: string;
    password: string;
  };

  export type PatientEmailSignupSendCodeInput = {
    email: string;
    password: string;
    medicalCardNumber: string;
  };

  export type SignInInput<TType extends AuthProvider> = TType extends AuthProvider.EMAIL ? UserEmailSigninInput : never;

  export type CreatePatientInput<TType extends AuthProvider> = TType extends AuthProvider.EMAIL
    ? PatientEmailSignupSendCodeInput
    : never;

  export interface PatientAuthService<TType extends AuthProvider> {
    signIn(input: SignInInput<TType>): Promise<AuthPatient>;
    createPatientOrFail(input: CreatePatientInput<TType>): Promise<Patient>;
  }

  export interface DoctorAuthService<TType extends AuthProvider> {
    signIn(input: SignInInput<TType>): Promise<AuthDoctor>;
  }

  export interface ManagerAuthService<TType extends AuthProvider> {
    signIn(input: SignInInput<TType>): Promise<AuthManager>;
  }
}
