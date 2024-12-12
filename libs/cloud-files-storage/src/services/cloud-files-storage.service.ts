import { Inject, Injectable } from '@nestjs/common';
import { BucketName } from 'aws-sdk/clients/elastictranscoder';
import { DeleteObjectOutput, HeadObjectOutput, ObjectKey } from 'aws-sdk/clients/s3';

import { CLOUD_FILES_STORAGE_OPTIONS_PROVIDER_NAME, S3ModuleOptions } from '../cloud-files-storage.types';
import { S3Service } from './s3.service';

type fileActions = 'putObject' | 'getObject';

@Injectable()
export class CloudFilesStorageService {
  constructor(
    private readonly s3Service: S3Service,
    @Inject(CLOUD_FILES_STORAGE_OPTIONS_PROVIDER_NAME)
    private readonly options: S3ModuleOptions,
  ) {}

  private _getBucketName(bucket: 'private' | 'public') {
    if (bucket === 'public') {
      return this.options.publicBucket;
    } else {
      return this.options.privateBucket;
    }
  }

  async getSignedUrl(
    bucket: 'private' | 'public',
    action: fileActions,
    input: {
      fileKey: string;
      contentType?: string;
    },
  ): Promise<string> {
    const writeParams = {
      Bucket: this._getBucketName(bucket),
      Expires: action === 'putObject' ? this.options.putActionExpiresSec : this.options.getActionExpiresSec,
      Key: input.fileKey,
    } as any;

    if (action === 'putObject' && input.contentType) {
      writeParams.ContentType = input.contentType;
    }

    return new Promise((resolve, reject) => {
      this.s3Service.client.getSignedUrl(action, writeParams, (err, url) => {
        if (err) {
          return reject(err);
        }
        return resolve(url);
      });
    });
  }

  async headObject(filekey: ObjectKey, bucket: BucketName): Promise<HeadObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3Service.client.headObject(
        {
          Bucket: bucket,
          Key: filekey,
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        },
      );
    });
  }

  async deleteObject(filekey: ObjectKey, bucket: BucketName): Promise<DeleteObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3Service.client.deleteObject(
        {
          Bucket: bucket,
          Key: filekey,
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        },
      );
    });
  }
}
