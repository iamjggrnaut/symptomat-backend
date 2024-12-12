import { InputType } from '@nestjs/graphql';

import { UserEmailUpdateInput } from '../../common/inputs';

@InputType()
export class PatientEmailUpdateInput extends UserEmailUpdateInput {}
