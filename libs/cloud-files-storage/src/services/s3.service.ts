import { Inject, Injectable } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';

import { CLOUD_FILES_STORAGE_OPTIONS_PROVIDER_NAME, S3ModuleOptions } from '../cloud-files-storage.types';

@Injectable()
export class S3Service {
  private _client: S3;
  constructor(
    @Inject(CLOUD_FILES_STORAGE_OPTIONS_PROVIDER_NAME)
    private readonly options: S3ModuleOptions,
  ) {
    this._client = this.createS3FromOptions();
  }

  private createS3FromOptions(): S3 {
    return new S3({
      signatureVersion: 'v4',
      region: this.options.region,
      credentials: {
        accessKeyId: this.options.accessKeyId,
        secretAccessKey: this.options.secretAccessKey,
      },
      endpoint: this.options.endpoint,
    });
  }

  get client() {
    return this._client;
  }
}
