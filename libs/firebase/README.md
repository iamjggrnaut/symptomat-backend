# FirebaseModule

**FirebaseService**

```typescript
client: FirebaseAdmin.app.App
```

**PushNotificationsService**

```typescript
  async sendToUser(
    token: string,
    notification: FirebaseAdmin.messaging.NotificationMessagePayload,
    data: Record<string, string> = {},
  ): Promise<string>
```

```typescript

  async sendToTopic(
    topic: string,
    notification: FirebaseAdmin.messaging.NotificationMessagePayload,
    data: Record<string, string> = {},
  ): Promise<string>
```

### Example

With `useFactory` init options

```typescript
  FirebaseModule.forRootAsync(firebaseFactory)
```

</details>

  <details>
    <summary>firebase.factory.ts</summary>

```typescript
import { ConfigService } from '@nestjs/config';
import { FirebaseModuleOptions } from '@purrweb/firebase';

export const firebaseFactory = {
  useFactory: (configService: ConfigService): FirebaseModuleOptions => {
    return {
      debug: true,
      serviceAccountPathOrObject: {
        clientEmail: configService.get<string>('firebase.clientEmail'),
        privateKey: configService.get<string>('firebase.privateKey'),
        projectId: configService.get<string>('firebase.projectId'),
      },
    };
  },
  inject: [ConfigService],
};


```

</details>
