import { UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { AdminRoleGuard } from 'src/admins/v1/guards';
import { UserRoles } from 'src/auth/decorators';

import { UsersRole } from '../../common/types/users.types';
import { Hospital } from '../../hospitals/entities';
import { CreateHospitalDto } from '../../hospitals/hospitals.dto';
import { HospitalsCrudService } from '../services/hospital.crud.service';

@ApiTags('Admin-panel. Hospitals')
@ApiBearerAuth()
@Crud({
  model: {
    type: Hospital,
  },
  dto: {
    create: CreateHospitalDto,
    update: CreateHospitalDto,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
    createOneBase: {
      decorators: [UserRoles(UsersRole.ADMIN)],
    },
    updateOneBase: {
      decorators: [UserRoles(UsersRole.ADMIN)],
    },
    deleteOneBase: {
      decorators: [UserRoles(UsersRole.ADMIN)],
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
@Controller('/admin/hospitals')
export class HospitalsCrudController implements CrudController<Hospital> {
  constructor(public service: HospitalsCrudService) {}

  get base(): CrudController<Hospital> {
    return this;
  }

  @Override('getOneBase')
  @ApiOperation({ summary: 'Get hospital by id' })
  @ApiParam({ name: 'id', description: 'Hospital id', type: String, format: 'uuid' })
  @UserRoles(UsersRole.ADMIN)
  async getOneHospital(@ParsedRequest() req: CrudRequest) {
    return this.service.getOneHospitalById(req);
  }

  @Override('getManyBase')
  @ApiOperation({ summary: 'Get many hospitals' })
  @UserRoles(UsersRole.ADMIN)
  async getManyHospitals(@ParsedRequest() req: CrudRequest) {
    return this.service.getManyHospitalsWithLimit(req);
  }

  @Override('deleteOneBase')
  @ApiOperation({ summary: 'Delete hospital with doctors' })
  @UserRoles(UsersRole.ADMIN)
  async deleteOneHospital(@ParsedRequest() req: CrudRequest) {
    return this.service.deleteOneHospital(req);
  }
}
