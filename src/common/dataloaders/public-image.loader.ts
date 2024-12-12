import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DataLoader from 'dataloader';

@Injectable()
export class PublicImageLoader {
  constructor(private readonly configService: ConfigService) {}

  generateDataLoader() {
    const publicUrl = this.configService.get<string>('s3.publicUrl');
    const batchPublicImages = async (imageKeys: string[]): Promise<string[]> => {
      const imageUrlsList: { [key: string]: string } = {};
      imageKeys.forEach((key) => {
        imageUrlsList[key] = `${publicUrl}\/${key}`;
      });
      return imageKeys.map((key) => imageUrlsList[key]);
    };
    return new DataLoader<string, string>(batchPublicImages);
  }
}
