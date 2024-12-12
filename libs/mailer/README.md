# MailerModule

**MailerService**

```typescript
client: nodemailer.Transporter
```

```typescript
  async sendMail(mailOptions: Mail.Options): Promise<boolean>
```

### Example

With `useClass` init options

```
MailerModule.forRootAsync({
  useClass: MailerConfigService,
}),
```

</details>

  <details>
    <summary>mailer-config.service.ts</summary>

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModuleOptions, MailerOptionsFactory } from '@purrweb/mailer';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createOptions(): MailerModuleOptions {
    return {
      smtp: {
        host: this.configService.get<string>('mailer.smtp.host'),
        port: this.configService.get<number>('mailer.smtp.port'),
        auth: {
          user: this.configService.get<string>('mailer.smtp.user'),
          pass: this.configService.get<string>('mailer.smtp.pass'),
        },
        secure: this.configService.get<boolean>('mailer.smtp.secure'),
      },
      senderEmail: this.configService.get<string>('mailer.senderEmail'),
    };
  }
}

```

</details>
