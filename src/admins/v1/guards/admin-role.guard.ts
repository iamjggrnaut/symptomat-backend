import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Admin } from 'src/admins/admin.entity';

import { UsersRole } from '../../../common/types/users.types';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UsersRole[]>('roles', context.getHandler());
    if (!roles.length) {
      return false;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user as Admin;

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        `Invalid user role ${user.role.toUpperCase()}, required ${roles.length > 1 ? 'one of ' : ''}${roles
          .join(',')
          .toUpperCase()}`,
      );
    }
    return true;
  }
}
