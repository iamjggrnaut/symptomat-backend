import { Injectable, UnauthorizedException } from '@nestjs/common';
import FB from 'fb';

import { FacebookUser } from '../fb-auth-mobile.types';

@Injectable()
export class FacebookAuthService {
  async validateTokenOrFail(accessToken: string): Promise<FacebookUser> {
    try {
      const user = await FB.api('me', {
        fields: 'email,first_name,last_name',
        access_token: accessToken,
      });

      // TODO: remove when facebook app is live
      return {
        id: user.id,
        email: user.email || `${user.id}@gmail.com`,
        firstName: user.first_name,
        lastName: user.last_name,
      };
    } catch (error) {
      throw new UnauthorizedException(`Invalid facebook token ${error.message || ''}`);
    }
  }
}
