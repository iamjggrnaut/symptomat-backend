import { UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { AdminRoleGuard } from 'src/admins/v1/guards';
import { UserRoles } from 'src/auth/decorators';
import { Patient } from 'src/patients/entities/patient.entity';

import { UsersRole } from '../../common/types/users.types';
import { PatientsCrudService } from '../services/patients.crud.service';

@ApiTags('Admin-panel. Patients')
@ApiBearerAuth()
@Crud({
  model: {
    type: Patient,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
    getManyBase: {
      decorators: [UserRoles(UsersRole.ADMIN)],
    },
    getOneBase: {
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
@Controller('/admin/patients')
export class PatientsCrudController implements CrudController<Patient> {
  constructor(public service: PatientsCrudService) {}
}
