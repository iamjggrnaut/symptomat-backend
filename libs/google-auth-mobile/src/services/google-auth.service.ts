import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { GOOGLE_AUTH_OPTIONS_PROVIDER_NAME, GoogleAuthModuleOptions, GoogleUser } from '../google-auth-mobile.types';
import { GoogleOAuthClientService } from './google-oauth-client.service';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly googleAuth: GoogleOAuthClientService,
    @Inject(GOOGLE_AUTH_OPTIONS_PROVIDER_NAME)
    private readonly options: GoogleAuthModuleOptions,
  ) {}

  async validateTokenOrFail(idToken: string): Promise<GoogleUser> {
    try {
      const ticket = await this.googleAuth.client.verifyIdToken({
        idToken,
        audience: [this.options.clientId, this.options.iosClientId, this.options.androidClientId],
      });
      return ticket.getPayload() as GoogleUser;
    } catch (error) {
      throw new UnauthorizedException(`Invalid google token ${error.message || ''}`);
    }
  }
}
