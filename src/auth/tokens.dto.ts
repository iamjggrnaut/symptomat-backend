import { IsString } from 'class-validator';
import { AuthRefreshToken } from 'src/auth/auth.types';

export class RefreshTokenDto {
  @IsString()
  refreshToken: AuthRefreshToken;
}
