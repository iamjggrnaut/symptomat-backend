import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import * as Sentry from '@sentry/node';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface SentryInterceptorOptions {
  filters?: {
    fromStatus?: number;
  };
}

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private readonly options?: SentryInterceptorOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(null, (exception) => {
        if (this.shouldReport(exception)) {
          Sentry.withScope((scope) => {
            switch (context.getType<GqlContextType>()) {
              case 'http':
                return this.captureHttpException(scope, context.switchToHttp(), exception);
              case 'ws':
                return this.captureWsException(scope, context.switchToWs(), exception);
              case 'graphql':
                return this.captureGraphqlException(scope, GqlExecutionContext.create(context), exception);
            }
          });
        }
      }),
    );
  }

  private captureHttpException(scope: Sentry.Scope, http: HttpArgumentsHost, exception: any): void {
    const req = http.getRequest();
    const user = req.user;

    const transaction = Sentry.startTransaction({
      name: req.url,
    });

    if (user) {
      scope.setUser({
        id: user.id,
        role: user.role,
      });
    }
    const data = Sentry.Handlers.parseRequest(<any>{}, req, {
      ip: true,
    });
    scope.setExtra('req', data.request);
    Sentry.captureException(exception);

    transaction.finish();
  }

  private captureWsException(scope: Sentry.Scope, ws: WsArgumentsHost, exception: any): void {
    const transaction = Sentry.startTransaction({
      name: 'websocket error',
    });

    scope.setExtra('ws_client', ws.getClient());
    scope.setExtra('ws_data', ws.getData());

    Sentry.captureException(exception);

    transaction.finish();
  }

  private captureGraphqlException(scope: Sentry.Scope, context: GqlExecutionContext, exception: Error): void {
    const req = context.getContext().request;
    const user = req.user;

    const transaction = Sentry.startTransaction({
      name: exception.message,
    });

    if (user) {
      scope.setUser({
        id: user.id,
        role: user.role,
      });
    }
    const data = Sentry.Handlers.parseRequest(<any>{}, req, {
      ip: true,
    });

    scope.setExtra('req', data.request);
    req?.body?.query && scope.setExtra('query', req.body.query);
    req?.body?.variables && scope.setExtra('variables', req.body.variables);

    Sentry.captureException(exception);

    transaction.finish();
  }

  private shouldReport(exception: any) {
    if (this.options && !this.options.filters) return true;

    if (this.options) {
      if (this.options.filters.fromStatus) {
        if (exception.status) {
          return exception.status >= this.options.filters.fromStatus;
        } else {
          return true;
        }
      }
      return true;
    } else {
      return true;
    }
  }
}
