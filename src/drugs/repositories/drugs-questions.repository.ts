import { EntityRepository, Repository } from 'typeorm';

import { DrugsQuestions } from '../entities';

@EntityRepository(DrugsQuestions)
export class DrugsQuestionsRepository extends Repository<DrugsQuestions> {}
