import { InputType } from '@nestjs/graphql';
import { UserUpdateLanguageInput } from 'src/common/inputs/user-update-language';

@InputType()
export class DoctorUpdateLanguageInput extends UserUpdateLanguageInput {}
