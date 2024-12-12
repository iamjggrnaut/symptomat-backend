import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const ctx = GqlExecutionContext.create(context);
    return request ? request : ctx.getContext().req;
  }

  handleRequest(err: Error, user: any) {
    if (err || !user || !!user.blockedAt) {
      throw err || new AuthenticationError('Invalid token');
    }
    return user;
  }
}
