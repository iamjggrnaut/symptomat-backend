import { Module } from '@nestjs/common';

import { FacebookAuthService } from './services';

@Module({
  providers: [FacebookAuthService],
  exports: [FacebookAuthService],
})
export class FbAuthMobileModule {}
