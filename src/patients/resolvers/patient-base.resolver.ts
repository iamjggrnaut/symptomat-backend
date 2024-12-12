import { Resolver } from '@nestjs/graphql';

import { PatientModelBase } from '../models/patient-base.model';

@Resolver(() => PatientModelBase, { isAbstract: true })
export class PatientBaseResolver {}
