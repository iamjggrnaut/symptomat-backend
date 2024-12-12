import { Body, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { AdminRoleGuard } from 'src/admins/v1/guards';
import { UserRoles } from 'src/auth/decorators';
import { UpdateHospitalManagerDto } from 'src/hospital-managers/dto/update-hospital-manager.dto';

import { UsersRole } from '../../common/types/users.types';
import { CreateHospitalManagerDto } from '../../hospital-managers/dto/hospital-manager.dto';
import { HospitalManager } from '../../hospital-managers/entities/hospital-managers.entity';
import { HospitalManagerEmailAuthService } from '../../hospital-managers/services/hospital-managers-email-auth.service';
import { UniqManagersEmailGuard } from '../guards';
import { HospitalManagersCrudService } from '../services/hospital-managers.crud.service';

@ApiTags('Admin-panel. Hospital-managers')
@ApiBearerAuth()
@Crud({
  model: {
    type: HospitalManager,
  },
  dto: {
    update: UpdateHospitalManagerDto,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'updateOneBase', 'deleteOneBase', 'createOneBase'],
    getManyBase: {
      decorators: [UserRoles(UsersRole.ADMIN)],
    },
    getOneBase: {
      decorators: [UserRoles(UsersRole.ADMIN)],
    },
    createOneBase: {
      decorators: [UserRoles(UsersRole.ADMIN)],
    },
    deleteOneBase: {
      decorators: [UserRoles(UsersRole.ADMIN)],
    },
    updateOneBase: {
      decorators: [UserRoles(UsersRole.ADMIN), UseGuards(UniqManagersEmailGuard)],
    },
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@UseGuards(AuthGuard(), AdminRoleGuard)
@Controller('/admin/hospital-managers')
export class HospitalManagersCrudController implements CrudController<HospitalManager> {
  constructor(
    public service: HospitalManagersCrudService,
    private readonly hospitalManagerEmailAuthService: HospitalManagerEmailAuthService,
  ) {}

  @Override('createOneBase')
  @UserRoles(UsersRole.ADMIN)
  @ApiBody({ type: CreateHospitalManagerDto })
  @ApiOperation({ summary: 'Send code for sign-up' })
  async sendCode(@Body() dto: CreateHospitalManagerDto) {
    return this.hospitalManagerEmailAuthService.sendCodeForSignup(dto);
  }
}
