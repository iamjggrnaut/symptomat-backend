import { Inject, Injectable } from '@nestjs/common';
import FirebaseAdmin from 'firebase-admin';

import { FIREBASE_OPTIONS_PROVIDER_NAME, FirebaseModuleOptions } from '../firebase.types';

@Injectable()
export class FirebaseService {
  private _client: FirebaseAdmin.app.App;

  constructor(
    @Inject(FIREBASE_OPTIONS_PROVIDER_NAME)
    public readonly options: FirebaseModuleOptions,
  ) {
    this._client = this.createClientFromOptions();
  }

  private createClientFromOptions() {
    return FirebaseAdmin.initializeApp({
      credential: FirebaseAdmin.credential.cert(this.options.serviceAccountPathOrObject),
    });
  }

  get client(): FirebaseAdmin.app.App {
    return this._client;
  }
}
