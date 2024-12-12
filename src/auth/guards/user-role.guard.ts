import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Admin } from 'src/admins/admin.entity';
import { Doctor } from 'src/doctors/entities';
import { HospitalManager } from 'src/hospital-managers/entities/hospital-managers.entity';
import { Patient } from 'src/patients/entities/patient.entity';

import { AuthUser } from '../auth.types';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<AuthUser['role'][]>('roles', context.getHandler());

    if (!roles.length) {
      return false;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().request || context.switchToHttp().getRequest();
    const user: Patient | Admin | HospitalManager | Doctor = request.user;

    await this._check(context, user);

    return true;
  }

  private async _check(context: ExecutionContext, user: AuthUser): Promise<boolean> {
    const roles = this.reflector.get<AuthUser['role'][]>('roles', context.getHandler());

    if (roles.includes(user.role)) {
      return true;
    } else {
      throw new ForbiddenException(
        `Invalid user role ${user.role.toUpperCase()}, required ${roles.length > 1 ? 'one of ' : ''}${roles
          .join(',')
          .toUpperCase()}`,
      );
    }
  }
}
