import { Injectable } from '@nestjs/common';

import { RedisService } from './redis.service';

@Injectable()
export class CloudCacheStorageService {
  constructor(private readonly redisService: RedisService) {}

  setValue(key: string, value: Record<string, any>) {
    this.redisService.client.set(key, JSON.stringify(value));
  }

  setValueWithExp(key: string, value: Record<string, any>, expireInSec = 60) {
    const expDate = new Date();
    expDate.setSeconds(expDate.getSeconds() + expireInSec);
    const expDateISO = expDate.toISOString();

    console.log('Saving to Redis:', { key, value, expDate: expDateISO });

    const result = this.redisService.client.set(
      key,
      JSON.stringify({ ...value, expDate: expDateISO }),
      'EX',
      expireInSec,
    );

    console.log('Redis set result:', result);

    return {
      key,
      value,
      expDate: expDateISO,
    };
  }

  async getValue<T>(key: string): Promise<null | T> {
    const value = await this.redisService.client.get(key);
    if (value) {
      return JSON.parse(value);
    } else {
      return null;
    }
  }

  async deleteValue(key: string): Promise<boolean> {
    const res = await this.redisService.client.del(key);
    return Boolean(res);
  }
}
