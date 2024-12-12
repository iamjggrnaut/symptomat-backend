import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsRepository } from 'src/admins/admin.repository';
import { PatientsRepository } from 'src/patients/repositories';

import { AdminsController } from './v1/admins.controller';
import { AdminAuthService, AdminProfileService } from './v1/services';

@Module({
  imports: [TypeOrmModule.forFeature([AdminsRepository, PatientsRepository])],
  controllers: [AdminsController],
  providers: [AdminAuthService, AdminProfileService],
})
export class AdminsModule {}
