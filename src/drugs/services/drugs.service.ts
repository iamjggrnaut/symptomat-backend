import { Injectable } from '@nestjs/common';
import { Question } from 'src/questions/entities';
import { QuestionsRepository } from 'src/questions/repositories';

import { Drug } from '../entities';
import { DrugsQuestionsRepository, DrugsRepository } from '../repositories';

@Injectable()
export class DrugsService {
  constructor(
    private readonly drugsRepository: DrugsRepository,
    private readonly drugsQuestionsRepository: DrugsQuestionsRepository,

    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async search(filter?: string): Promise<Drug[]> {
    const cyrillicDrugsQuery = this.drugsRepository.search(filter, { startAtCyrillic: true });
    const otherDrugsQuery = this.drugsRepository.search(filter, { startAtCyrillic: false });

    const drugs = await Promise.all([cyrillicDrugsQuery, otherDrugsQuery]).then(([cyrillicDrugs, otherDrugs]) => [
      ...cyrillicDrugs,
      ...otherDrugs,
    ]);

    return drugs;
  }

  async findDrugQuestions(drugId: string): Promise<Question[]> {
    const questionsIds = await this.drugsQuestionsRepository
      .find({
        where: {
          drugId,
        },
        select: ['questionId'],
      })
      .then((drugQuestions) => drugQuestions.map((dq) => dq.questionId));

    const questions = await this.questionsRepository.findByIds(questionsIds, { where: { isActual: true } });
    return questions;
  }
}
