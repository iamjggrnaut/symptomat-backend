import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthRefreshToken, AuthToken, JwtPayload } from 'src/auth/auth.types';

import { TOKEN_TYPE } from '../auth.enums';

@Injectable()
export class AuthNService {
  private tokenExpiresIn: number;
  private refreshSecret: string;
  private refreshTokenExpiresIn: string;

  constructor(private readonly jwtService: JwtService, readonly configService: ConfigService) {
    this.tokenExpiresIn = this.configService.get<number>('jwt.expiresIn');
    this.refreshSecret = this.configService.get<string>('jwt.refreshSecret');
    this.refreshTokenExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn');
  }

  async createJwtToken(id: string, tokenType: TOKEN_TYPE): Promise<AuthToken> {
    const expiration = new Date();
    expiration.setTime(this.tokenExpiresIn * 1000 + expiration.getTime());

    const payload = { id, expiration, tokenType } as JwtPayload;

    return this.jwtService.sign(payload);
  }

  async createRefreshJwtToken(id: string, tokenType: TOKEN_TYPE): Promise<AuthRefreshToken> {
    const payload = { id, tokenType } as JwtPayload;

    return this.jwtService.sign(payload, { expiresIn: this.refreshTokenExpiresIn, secret: this.refreshSecret });
  }

  async refreshAccessToken(oldRefreshToken: AuthRefreshToken) {
    try {
      const { id, tokenType } = await this.verifyTokenAsync(oldRefreshToken);
      const token = await this.createJwtToken(id, tokenType);
      const refreshToken = await this.createRefreshJwtToken(id, tokenType);
      return {
        token,
        refreshToken,
      };
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw new HttpException('Expired token', HttpStatus.UNAUTHORIZED);
      } else if (e.message === 'invalid signature') {
        throw new HttpException('invalid token', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyTokenAsync(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, { secret: this.refreshSecret });
  }
}
