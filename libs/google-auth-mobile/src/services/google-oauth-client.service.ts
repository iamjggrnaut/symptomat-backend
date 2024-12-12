import { Inject, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { GOOGLE_AUTH_OPTIONS_PROVIDER_NAME, GoogleAuthModuleOptions } from '../google-auth-mobile.types';

@Injectable()
export class GoogleOAuthClientService {
  private _client: OAuth2Client;

  constructor(
    @Inject(GOOGLE_AUTH_OPTIONS_PROVIDER_NAME)
    private readonly options: GoogleAuthModuleOptions,
  ) {
    this._client = this.createClientFromOptions();
  }

  private createClientFromOptions(): OAuth2Client {
    return new OAuth2Client({
      clientId: this.options.clientId,
      clientSecret: this.options.clientSecret,
    });
  }

  get client() {
    return this._client;
  }
}
