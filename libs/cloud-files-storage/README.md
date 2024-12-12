# CloudFilesStorageModule

**S3Service**
`client` for s3

**CloudFilesStorageService**

```typescript
async getSignedUrl(
  bucket: 'private' | 'public',
  action: fileActions,
  input: { fileKey: string; contentType?: string;
}): Promise<string>
```

```typescript
async headObject(filekey: ObjectKey, bucket: BucketName): Promise<HeadObjectOutput>
```

```typescript
async deleteObject(filekey: ObjectKey, bucket: BucketName): Promise<DeleteObjectOutput>
```

### Example

With `useClass` init options

```
CloudFilesStorageModule.forRootAsync({
  useClass: S3ConfigService,
}),
```

</details>

  <details>
    <summary>s3-config.service.ts</summary>

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3ModuleOptions, S3OptionsFactory } from '@purrweb/cloud-files-storage';

@Injectable()
export class S3ConfigService implements S3OptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createS3Options(): S3ModuleOptions {
    return {
      region: this.configService.get<string>('s3.region'),
      accessKeyId: this.configService.get<string>('aws.accessKeyId'),
      secretAccessKey: this.configService.get<string>('aws.secretAccessKey')
    };
  }
}

```

</details>
