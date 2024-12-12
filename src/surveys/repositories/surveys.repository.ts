import { EntityRepository, Repository } from 'typeorm';

import { Survey } from '../entities';

@EntityRepository(Survey)
export class SurveysRepository extends Repository<Survey> {}
