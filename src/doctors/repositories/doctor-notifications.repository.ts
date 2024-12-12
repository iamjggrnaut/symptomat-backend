import { EntityRepository, Repository } from 'typeorm';

import { DoctorNotification } from '../entities';

@EntityRepository(DoctorNotification)
export class DoctorNotificationRepository extends Repository<DoctorNotification> {}
