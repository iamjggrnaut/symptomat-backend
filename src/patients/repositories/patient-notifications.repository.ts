import { EntityRepository, Repository } from 'typeorm';

import { PatientNotification } from '../entities';

@EntityRepository(PatientNotification)
export class PatientNotificationsRepository extends Repository<PatientNotification> {}
