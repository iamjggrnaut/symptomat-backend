import { InputType } from '@nestjs/graphql';

import { UserEmailSignInInput } from '../../common/inputs';

@InputType()
export class PatientEmailSignInInput extends UserEmailSignInInput {}
