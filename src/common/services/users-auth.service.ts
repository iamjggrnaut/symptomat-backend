import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { TOKEN_TYPE } from '../../auth/auth.enums';
import { pairOfTokens } from '../../auth/auth.types';
import { AuthNService } from '../../auth/services';
import { Doctor } from '../../doctors/entities';
import { HospitalManager } from '../../hospital-managers/entities/hospital-managers.entity';
import { Patient } from '../../patients/entities';

@Injectable()
export class UsersAuthService {
  constructor(private readonly authService: AuthNService) {}

  async createAuthTokensOrFail(user: Patient | Doctor | HospitalManager): Promise<pairOfTokens> {
    try {
      let tokenType: TOKEN_TYPE;
      if (user instanceof Patient) {
        tokenType = TOKEN_TYPE.patient;
      }
      if (user instanceof Doctor) {
        tokenType = TOKEN_TYPE.doctor;
      }
      if (user instanceof HospitalManager) {
        tokenType = TOKEN_TYPE.manager;
      }
      const token = await this.authService.createJwtToken(user.id, tokenType);
      const refreshToken = await this.authService.createRefreshJwtToken(user.id, tokenType);
      return { token, refreshToken };
    } catch (error) {
      Logger.error(error.message, error.stack, `${this.constructor.name} | ${this.createAuthTokensOrFail.name}`);

      throw new HttpException('Something went wrong, try again later', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
