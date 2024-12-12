import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { UsersRole } from 'src/common/types';

import { Doctor } from '../entities';
import { DoctorNotificationsService } from '../services/doctor-notifications.service';

@Resolver()
export class DoctorNotificationsMutationResolver {
  constructor(private readonly doctorNotificationsService: DoctorNotificationsService) {}

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Mutation(() => Boolean, {
    description: 'Read all doctor notifications',
  })
  doctorReadAllNotifications(
    @IAM()
    doctor: Doctor,
  ) {
    return this.doctorNotificationsService.readAllNotifications(doctor.id);
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Mutation(() => Boolean, {
    description: 'Remove doctor notification by id',
  })
  doctorNotificationRemove(
    @Args('id') doctorNotificationId: string,
    @IAM()
    doctor: Doctor,
  ) {
    return this.doctorNotificationsService.removeDoctorNotification(doctor.id, doctorNotificationId);
  }
}
