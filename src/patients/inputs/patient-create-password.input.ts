import { InputType, PickType } from '@nestjs/graphql';
import { UserPasswordInput } from 'src/common/inputs';

@InputType()
export class PatientCreatePasswordInput extends PickType(UserPasswordInput, ['password']) {}
