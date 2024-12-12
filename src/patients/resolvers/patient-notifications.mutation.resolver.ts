import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { UsersRole } from 'src/common/types';

import { Patient } from '../entities';
import { PatientNotificationsService } from '../services/patient-notifications.service';

@Resolver()
export class PatientNotificationsMutationResolver {
  constructor(private readonly patientNotificationsService: PatientNotificationsService) {}

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.PATIENT)
  @Mutation(() => Boolean, {
    description: 'Read all patient notifications',
  })
  patientReadAllNotifications(
    @IAM()
    patient: Patient,
  ) {
    return this.patientNotificationsService.readAllNotifications(patient.id);
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.PATIENT)
  @Mutation(() => Boolean, {
    description: 'Remove patient notification by id',
  })
  patientNotificationRemove(
    @Args('id') patientNotificationId: string,
    @IAM()
    patient: Patient,
  ) {
    return this.patientNotificationsService.removePatientNotification(patient.id, patientNotificationId);
  }
}
