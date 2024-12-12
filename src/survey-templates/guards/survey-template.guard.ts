import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';

@Injectable()
export class SurveyTemplateGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request;
    const inputProperty = request.body?.variables?.input?.property;

    if (!inputProperty) {
      throw new UserInputError('inputProperty is required in variables.input');
    }

    return true;
  }
}
