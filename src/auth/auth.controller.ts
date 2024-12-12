import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthNService } from 'src/auth/services';
import { RefreshTokenDto } from 'src/auth/tokens.dto';

@ApiTags('refresh token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthNService) {}

  @Post('refresh')
  @ApiOperation({
    summary: 'Get new access/refresh based on refresh',
  })
  refreshAccessToken(@Body() oldRefreshToken: RefreshTokenDto) {
    return this.authService.refreshAccessToken(oldRefreshToken.refreshToken);
  }
}
