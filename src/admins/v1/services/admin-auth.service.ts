import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminsRepository } from 'src/admins/admin.repository';
import { AuthAdmin } from 'src/admins/admins.types';
import { AdminsSignInBodyDto } from 'src/admins/v1/admins.dto';
import { AuthRefreshToken, AuthToken, JwtPayload } from 'src/auth/auth.types';
import { AuthNService } from 'src/auth/services';

import { TOKEN_TYPE } from '../../../auth/auth.enums';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly authService: AuthNService,
    @InjectRepository(AdminsRepository)
    private readonly repository: AdminsRepository,
  ) {}

  async signIn(input: AdminsSignInBodyDto): Promise<AuthAdmin> {
    const admin = await this.repository.findByCredentialsOrFail(input.email, input.password);

    let token: AuthToken;
    let refreshToken: AuthRefreshToken;

    try {
      token = await this.authService.createJwtToken(admin.id, TOKEN_TYPE.admin);
      refreshToken = await this.authService.createRefreshJwtToken(admin.id, TOKEN_TYPE.admin);
    } catch (error) {
      throw new HttpException('Something went wrong, try again later', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      user: admin,
      token,
      refreshToken,
    };
  }

  async validateToken(refreshToken: string): Promise<JwtPayload> {
    return this.authService.verifyTokenAsync(refreshToken);
  }
}
