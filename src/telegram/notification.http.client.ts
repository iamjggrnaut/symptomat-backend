import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationHttpClient {
  private readonly logger = new Logger(NotificationHttpClient.name);
  private readonly apiBaseUrl = 'http://217.114.1.26:3000';

  async send(event: {
    type: string;
    payload: any;
    tgChatId?: number;
  }): Promise<boolean> {
    if (!event.tgChatId) {
      this.logger.debug('No tgChatId, skipping notification');
      return false;
    }

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/api/notifications`,
        event,
        { timeout: 5000 }
      );
      
      return response.data?.success === true;
    } catch (error) {
      this.logger.error(`Notification API error: ${error.message}`);
      return false;
    }
  }
}