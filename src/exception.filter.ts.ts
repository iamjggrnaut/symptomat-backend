import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-core';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@Catch(HttpException)
export class ExceptionFilter implements GqlExceptionFilter {
  private isDebug: boolean;

  constructor(readonly configService: ConfigService) {
    const env = configService.get<string>('environment');
    this.isDebug = ['development', 'staging'].includes(env);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const exceptionResponse = exception.getResponse();
    const contextType = host.getType<ContextType>();

    if (this.isDebug) {
      Logger.error(exception, exception.stack, 'ExceptionFilter');
      Logger.verbose(JSON.stringify(exception, null, 2), 'ExceptionFilter');
    }

    switch (contextType) {
      case ContextType.GRAPHQL:
        return this.handleGraphqlContext(exception, exceptionResponse);

      case ContextType.HTTP:
        return this.handleHttpContext(exception, host);

      default:
        return this.handleHttpContext(exception, host);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  handleGraphqlContext(exception: HttpException, exceptionResponse: string | object) {
    const response =
      typeof exceptionResponse === 'string'
        ? {
            message: exceptionResponse,
          }
        : (exceptionResponse as ExceptionResponse);

    switch (exception.getStatus()) {
      case StatusCodes.BAD_REQUEST:
        return new UserInputError(exception.message, {
          validationErrors: response.message,
        });

      case StatusCodes.UNAUTHORIZED:
        return new AuthenticationError(exception.message);

      case StatusCodes.FORBIDDEN:
        return new ForbiddenError(exception.message);

      default:
        return new ApolloError(exception.message, exception.getStatus().toString(), {
          validationErrors: response.message,
        });
    }
  }

  handleHttpContext(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}

interface ExceptionResponse {
  message: string;
}

enum ContextType {
  GRAPHQL = 'graphql',
  HTTP = 'http',
}
