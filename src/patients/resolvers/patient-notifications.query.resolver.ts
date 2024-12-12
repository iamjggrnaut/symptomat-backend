import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { UsersRole } from 'src/common/types/users.types';

import { PatientNotificationConnection } from '../models/patient-notification-connection';
import { PatientNotificationsService } from '../services/patient-notifications.service';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class PatientNotificationsQueryResolver {
  constructor(private readonly patientNotificationsService: PatientNotificationsService) {}

  @Query(() => PatientNotificationConnection, {
    description: 'Retrieve patient notifications',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientGetNotifications(
    @IAM('id') patientId: string,
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
    const patientNotifications = await this.patientNotificationsService.getNotifications({ patientId, first, after });
    return patientNotifications;
  }

  @Query(() => Int, {
    description: 'Retrieve patient notifications',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientGetUnreadNotificationsCount(@IAM('id') patientId: string) {
    return this.patientNotificationsService.getUnreadNotificationsCount(patientId);
  }
}
