import { Admin } from 'src/admins/admin.entity';
import { AuthRefreshToken, AuthToken } from 'src/auth/auth.types';

export enum AdminRole {
  ADMIN = 'admin',
}

export interface AuthAdmin {
  user: Admin;
  token: AuthToken;
  refreshToken: AuthRefreshToken;
}
