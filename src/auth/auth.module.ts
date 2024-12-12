import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsRepository } from 'src/admins/admin.repository';
import { HospitalManagersRepository } from 'src/hospital-managers/repository/hospital-managers.repository';
import { PatientsRepository } from 'src/patients/repositories';

import { DoctorRepository } from '../doctors/repositories';
import { AuthController } from './auth.controller';
import { JWTConfigService } from './jwt-config.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthNService, AuthZService } from './services';

PassportModule.register({ session: true });

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useClass: JWTConfigService,
    }),
    TypeOrmModule.forFeature([PatientsRepository, HospitalManagersRepository, AdminsRepository, DoctorRepository]),
  ],
  providers: [JwtStrategy, AuthNService, AuthZService],
  exports: [PassportModule, JwtStrategy, AuthNService, AuthZService],
  controllers: [AuthController],
})
export class AuthModule {}
