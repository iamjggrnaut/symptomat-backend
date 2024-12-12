import { SetMetadata } from '@nestjs/common';

import { AuthUser } from '../auth.types';

export const UserRoles = (...roles: AuthUser['role'][]) => SetMetadata('roles', roles);
