import { InputType } from '@nestjs/graphql';
import { DoctorSignUpInput } from 'src/common/inputs/users-auth/doctor-selfsignup.input';

@InputType()
export class DocSelfSignUp extends DoctorSignUpInput {}
