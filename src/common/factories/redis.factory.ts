import { readFileSync } from 'fs';
import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import { CloudCacheModuleOptions } from '@purrweb/cloud-cache-storage';

export const redisFactory = {
  useFactory: (configService: ConfigService): CloudCacheModuleOptions => {
    const env = configService.get<string>('environment');

    if (env === 'development') {
      return {
        port: configService.get<number>('redis.port'),
        host: configService.get<string>('redis.host'),
      };
    } else {
      return {
        password: configService.get<string>('redis.password'),
        sentinelPassword: configService.get<string>('redis.password'),
        sentinels: [
          {
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
          },
        ],
        name: configService.get<string>('redis.masterName'),
        role: 'master',
        tls: {
          cert: readFileSync(join(__dirname, '..', '..', '..', '..', '/yandex/root.crt')),
        },
      };
    }
  },
  inject: [ConfigService],
};
