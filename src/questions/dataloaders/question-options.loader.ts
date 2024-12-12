import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DataLoaderInterface } from 'src/common/types';

import { QuestionOption } from '../entities';
import { QuestionOptionsRepository } from '../repositories';

@Injectable()
export class QuestionOptionsLoader implements DataLoaderInterface<string, QuestionOption[] | null> {
  constructor(private readonly questionOptionsRepository: QuestionOptionsRepository) {}

  generateDataLoader() {
    return new DataLoader((questionsIds: string[]) =>
      this.questionOptionsRepository.loadQuestionsOptions(questionsIds),
    );
  }
}
