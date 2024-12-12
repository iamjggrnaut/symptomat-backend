import { Module } from '@nestjs/common';

import { AppleAuthService } from './services';

@Module({
  providers: [AppleAuthService],
  exports: [AppleAuthService],
})
export class AppleAuthMobileModule {}
