import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QuestionCategoriesRepository } from '../question-categories.repository';

@Injectable()
export class QuestionCategoriesService {
  constructor(
    @InjectRepository(QuestionCategoriesRepository)
    private readonly questionCategoriesRepository: QuestionCategoriesRepository,
  ) {}

  async findAll() {
    const cyrillicCategoriesQuery = this.questionCategoriesRepository.search({ startAtCyrillic: true });
    const otherCategoriesQuery = this.questionCategoriesRepository.search({ startAtCyrillic: false });

    const categories = await Promise.all([
      cyrillicCategoriesQuery,
      otherCategoriesQuery,
    ]).then(([cyrillicCategories, otherCategories]) => [...cyrillicCategories, ...otherCategories]);

    return categories;
  }
}
