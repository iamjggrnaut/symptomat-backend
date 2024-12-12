# GoogleMapsModule

**GoogleMapsService**

`client` for google-maps-services

```typescript
async placeAutocomplete(input: string)
```

### Example

With `useFactory` init options
```typescript
GoogleMapsModule.forRootAsync(gmsFactory),
```
</details>

  <details>
    <summary>gms.factory.ts</summary>

```typescript
import { ConfigService } from '@nestjs/config';
import { GoogleMapsModuleOptions } from '@purrweb/google-maps';

export const gmsFactory = {
  useFactory: (configService: ConfigService): GoogleMapsModuleOptions => {
    return {
      key: configService.get<string>('googleMapsApiKey'),
    };
  },
  inject: [ConfigService],
};

```
</details>

