import { InputType } from '@nestjs/graphql';

import { UserEmailSignUpSendCodeInput } from '../../common/inputs';

@InputType()
export class PatientEmailPasswordRecoverySendCodeInput extends UserEmailSignUpSendCodeInput {}
