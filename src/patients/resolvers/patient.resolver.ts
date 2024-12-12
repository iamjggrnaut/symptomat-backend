import { Resolver } from '@nestjs/graphql';

import { PatientModel } from '../models/patient.model';
import { PatientBaseResolver } from './patient-base.resolver';

@Resolver(() => PatientModel)
export class PatientResolver extends PatientBaseResolver {}
