import { readFileSync } from 'fs';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const env = this.configService.get<string>('environment');

    if (env === 'development') {
      return {
        type: 'postgres',
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        username: this.configService.get<string>('database.username'),
        password: this.configService.get<string>('database.password'),
        database: this.configService.get<string>('database.name'),
        entities: [__dirname + '../../../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      };
    } else {
      return {
        type: 'postgres',
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        username: this.configService.get<string>('database.username'),
        password: this.configService.get<string>('database.password'),
        database: this.configService.get<string>('database.name'),
        entities: [__dirname + '../../../**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
        ssl: {
          ca: readFileSync(join(__dirname, '..', '..', '..', '..', '/yandex/root.crt')),
        },
      };
    }
  }
}
