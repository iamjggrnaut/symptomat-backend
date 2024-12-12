import crypto from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import appleSigninAuth, { AppleUser } from 'apple-signin-auth';

@Injectable()
export class AppleAuthService {
  async validateTokenOrFail(idToken: string, nonce: string): Promise<AppleUser> {
    try {
      const appleIdTokenClaims = await appleSigninAuth.verifyIdToken(idToken, {
        nonce: nonce ? crypto.createHash('sha256').update(nonce).digest('hex') : undefined,
      });

      return appleIdTokenClaims;
    } catch (error) {
      throw new UnauthorizedException(`Invalid apple token ${error.message || ''}`);
    }
  }
}
