import { PickType } from '@nestjs/swagger';

import { HospitalManager } from '../entities/hospital-managers.entity';

export class CreateHospitalManagerDto extends PickType(HospitalManager, ['email', 'hospitalId']) {}
