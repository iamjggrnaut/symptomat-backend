# GoogleAuthMobileModule


**GoogleOAuthClientService**

```typescript
client: OAuth2Client
```

**GoogleAuthService**
```typescript
 async validateTokenOrFail(idToken: string, nonce: string): Promise<AppleUser>
```

### Example

With `useClass` init options
```typescript
GoogleAuthMobileModule.forRootAsync({
  useClass: GoogleAuthConfigService,
}),
```
</details>

  <details>
    <summary>google-auth-config.service.ts</summary>

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthModuleOptions, GoogleAuthModuleOptionsFactory } from '@purrweb/google-auth-mobile';

@Injectable()
export class GoogleAuthConfigService implements GoogleAuthModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createGoogleAuthModuleOptions(): GoogleAuthModuleOptions {
    return {
      clientId: this.configService.get<string>('googleAuth.googleAuth'),
      clientSecret: this.configService.get<string>('googleAuth.clientSecret'),
      iosClientId: this.configService.get<string>('googleAuth.iosClientId'),
      androidClientId: this.configService.get<string>('googleAuth.androidClientId'),
    };
  }
}

```
</details>

