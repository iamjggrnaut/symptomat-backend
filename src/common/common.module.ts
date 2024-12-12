import { Module } from '@nestjs/common';

import { FloatStringScalar } from './scalars';
import { UUIDScalar } from './scalars/uuid.scalar';

@Module({
  providers: [UUIDScalar, FloatStringScalar],
})
export class CommonModule {}
