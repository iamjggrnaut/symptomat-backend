import path from 'path';

import { Injectable } from '@nestjs/common';
import { FirebaseModuleOptions, FirebaseOptionsFactory } from '@purrweb/firebase';

@Injectable()
export class FirebaseConfigService implements FirebaseOptionsFactory {
  createOptions(): FirebaseModuleOptions {
    return {
      serviceAccountPathOrObject: path.resolve(__dirname, '../../../../firebase-adminsdk.json'),
    };
  }
}
