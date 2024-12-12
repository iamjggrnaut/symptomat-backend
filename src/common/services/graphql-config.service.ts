import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { ApolloError, SubscriptionServerOptions } from 'apollo-server-core';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import depthLimit from 'graphql-depth-limit';

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
  private isDebug: boolean;

  constructor(private readonly configService: ConfigService) {
    const env = configService.get<string>('environment');
    this.isDebug = ['development', 'staging'].includes(env);
  }

  createGqlOptions(): GqlModuleOptions {
    return {
      sortSchema: true,
      debug: this.isDebug,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: this.configService.get<boolean>('gqlIntrospectionEnable'),
      tracing: this.configService.get<boolean>('gqlTracingEnable'),
      playground: this.configService.get<boolean>('gqlPlaygroundEnable'),
      validationRules: [depthLimit(10)],
      installSubscriptionHandlers: true,
      subscriptions: this._configSubscriptions(),
      context: this._createContext.bind(this),
      formatError: this._formatError.bind(this),
    };
  }

  private _formatError(error: GraphQLError): GraphQLFormattedError {
    const e = { ...error };

    if (!this.isDebug) {
      const isInternaServerError = error.path && error.extensions?.code === 'INTERNAL_SERVER_ERROR';
      if (isInternaServerError) {
        return new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
      delete e.locations;
    }

    return e;
  }

  private _createContext({ req, connection }) {
    return {
      request: connection ? connection.context : req,
    };
  }

  private _configSubscriptions(): Partial<SubscriptionServerOptions> {
    return {
      onConnect: (connectionParams: any) => ({
        headers: {
          authorization: connectionParams.Authorization,
        },
      }),
    };
  }
}
