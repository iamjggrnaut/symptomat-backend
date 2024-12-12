import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersAuthService } from '../common/services/users-auth.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { HospitalManagersRepository } from './repository/hospital-managers.repository';
import { HospitalManagerMutationResolver } from './resolvers/hospital-managers.mutation.resolver';
import { HospitalManagerEmailAuthService } from './services/hospital-managers-email-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalManagersRepository]), NotificationsModule],
  providers: [HospitalManagerEmailAuthService, UsersAuthService, HospitalManagerMutationResolver],
  exports: [HospitalManagerEmailAuthService],
})
export class HospitalManagersModule {}
