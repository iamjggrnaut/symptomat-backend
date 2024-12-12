import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import robots from 'express-robots-txt';
import { ignoreFavicon } from 'src/utils';

import { AppModule } from './app.module';
import { ExceptionFilter } from './exception.filter.ts';

const useSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Surveys Admin API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const env = configService.get<string>('environment');
  const port = configService.get<number>('port');
  const sentryDsn = configService.get<string>('sentry.dsn');
  const sentryEnv = configService.get<string>('sentry.env');
  const corsClientUrls = configService.get<string[]>('corsClientUrls');

  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnv,
    debug: env === 'development',
    tracesSampleRate: 1.0,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new ExceptionFilter(configService));

  app.use(ignoreFavicon);

  app.use(robots({ UserAgent: '*', Disallow: '/' }));

  app.enableCors({
    origin: corsClientUrls,
    credentials: true,
  });

  useSwagger(app);

  await app.listen(port, () => {
    Logger.log(`Running on port ${port}`, 'NestApplication');
    Logger.log(`Environment ${env}`, 'NestApplication');
  });
}
bootstrap();
