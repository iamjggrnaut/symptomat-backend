import { Injectable, Logger } from '@nestjs/common';
import FirebaseAdmin from 'firebase-admin';

import { FirebaseService } from './firebase.service';

@Injectable()
export class PushNotificationsService {
  constructor(private readonly firebase: FirebaseService) {}

  async sendToUser(
    token: string,
    notification: FirebaseAdmin.messaging.NotificationMessagePayload,
    data: Record<string, string> = {},
  ): Promise<string> {
    return this.firebase.client
      .messaging()
      .send({
        token,
        notification,
        data: { ...notification, ...data },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
              sound: 'default',
            },
          },
        },
      })
      .then((response) => {
        if (this.firebase.options.debug) {
          Logger.debug(
            {
              notification,
              data,
              token,
              response,
            },
            `${this.constructor.name} | ${this.sendToUser.name}`,
          );
        }
        return response;
      })
      .catch((error) => {
        if (this.firebase.options.debug) {
          Logger.debug(
            {
              notification,
              data,
              token,
            },
            `${this.constructor.name} | ${this.sendToUser.name}`,
          );
        }
        Logger.error(error.message, error.stack, `${this.constructor.name} | ${this.sendToUser.name}`);
        throw error;
      });
  }

  async sendToTopic(
    topic: string,
    notification: FirebaseAdmin.messaging.NotificationMessagePayload,
    data: Record<string, string> = {},
  ): Promise<string> {
    return this.firebase.client
      .messaging()
      .send({
        topic,
        notification,
        data: { ...notification, ...data },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
              sound: 'default',
            },
          },
        },
      })
      .then((response) => {
        if (this.firebase.options.debug) {
          Logger.debug(
            {
              notification,
              data,
              topic,
              response,
            },
            `${this.constructor.name} | ${this.sendToTopic.name}`,
          );
        }
        return response;
      })
      .catch((error) => {
        if (this.firebase.options.debug) {
          Logger.debug(
            {
              notification,
              data,
              topic,
            },
            `${this.constructor.name} | ${this.sendToTopic.name}`,
          );
        }
        Logger.error(error.message, error.stack, `${this.constructor.name} | ${this.sendToTopic.name}`);
        throw error;
      });
  }
}
