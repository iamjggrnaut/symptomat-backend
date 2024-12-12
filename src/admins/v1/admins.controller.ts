import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRoles } from 'src/auth/decorators';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { ValidEmailPipe } from 'src/common/pipes';

import { UsersRole } from '../../common/types/users.types';
import { Admin } from '../admin.entity';
import { AdminDto, AdminsSignInBodyDto, AuthAdminDto } from './admins.dto';
import { AdminRoleGuard } from './guards';
import { AdminAuthService, AdminProfileService } from './services';

@ApiTags('[v1] Admins')
@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Controller('v1/admins')
export class AdminsController {
  constructor(private readonly authService: AdminAuthService, private readonly profileService: AdminProfileService) {}

  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign in via email/password',
  })
  @ApiBody({ type: AdminsSignInBodyDto })
  @ApiOkResponse({
    type: AuthAdminDto,
  })
  async signIn(@Body() input: AdminsSignInBodyDto): Promise<AuthAdminDto> {
    return this.authService.signIn(input);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve current admin',
  })
  @ApiOkResponse({
    type: AdminDto,
  })
  @UserRoles(UsersRole.ADMIN)
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async getMe(@IAM() admin: Admin): Promise<Admin> {
    return admin;
  }

  @Get('email-is-uniq')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check admin email for uniqueness',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  @UserRoles(UsersRole.ADMIN)
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async emailIsUniq(@Query('email', ValidEmailPipe) email: string): Promise<boolean> {
    return this.profileService.emailIsUniq(email);
  }
}
