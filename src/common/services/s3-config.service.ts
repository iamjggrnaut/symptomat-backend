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
      secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      endpoint: this.configService.get<string>('s3.endpoint'),
      privateBucket: this.configService.get<string>('s3.privateBucket'),
      publicBucket: this.configService.get<string>('s3.publicBucket'),
      putActionExpiresSec: this.configService.get<number>('s3.putActionExpiresSec'),
      getActionExpiresSec: this.configService.get<number>('s3.getActionExpiresSec'),
    };
  }
}
