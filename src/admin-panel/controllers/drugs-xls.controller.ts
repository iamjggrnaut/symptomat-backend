import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminRoleGuard } from 'src/admins/v1/guards';
import { UserRoles } from 'src/auth/decorators';

import { UsersRole } from '../../common/types/users.types';
import { DrugsXlsService } from '../services/drugs-xls.service';

@ApiTags('Admin-panel. Drugs-xls')
@ApiBearerAuth()
@UseGuards(AuthGuard(), AdminRoleGuard)
@Controller('/admin/drugs-xls')
export class DrugsXlsController {
  constructor(public service: DrugsXlsService) {}

  @UserRoles(UsersRole.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        drugs: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Parse drugs from xlsm file' })
  @Post()
  @UseInterceptors(FileInterceptor('drugs'))
  parse(@UploadedFile() file: Express.Multer.File) {
    return this.service.parse(file);
  }
}
