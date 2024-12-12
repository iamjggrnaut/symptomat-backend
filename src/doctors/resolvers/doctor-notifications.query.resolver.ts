import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { UsersRole } from 'src/common/types/users.types';

import { DoctorNotificationConnection } from '../models/doctor-notification-connection';
import { DoctorNotificationsService } from '../services/doctor-notifications.service';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class DoctorNotificationsQueryResolver {
  constructor(private readonly doctorNotificationsService: DoctorNotificationsService) {}

  @Query(() => DoctorNotificationConnection, {
    description: 'Retrieve doctor notifications',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorGetNotifications(
    @IAM('id') doctorId: string,
    @Args('first', {
      type: () => Int,
      defaultValue: 4,
      nullable: true,
      description: 'less than or equal 20',
    })
    first?: number,
    @Args('after', {
      type: () => String,
      nullable: true,
      description: 'cursor',
    })
    after?: string,
  ) {
    const doctorNotifications = await this.doctorNotificationsService.getNotifications({ doctorId, first, after });
    return doctorNotifications;
  }

  @Query(() => Int, {
    description: 'Retrieve unread doctor notifications count',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorGetUnreadNotificationsCount(@IAM('id') doctorId: string) {
    return this.doctorNotificationsService.getUnreadNotificationsCount(doctorId);
  }
}
