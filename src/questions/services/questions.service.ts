import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Question } from '../entities';
import { CreateCustomQuestionInput } from '../inputs/create-custom-question.input';
import { TemperatureAndPressureIndicators } from '../questions.constants';
import { QuestionIndicators } from '../questions.indicators.types';
import { QuestionType } from '../questions.types';
import { QuestionOptionsRepository, QuestionsRepository } from '../repositories';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionsRepository)
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionOptionsRepository: QuestionOptionsRepository,
  ) {}

  async findByTitleAndCategoryId(title: string, doctorId: string, categoryId?: string): Promise<Question[]> {
    const cyrillicQuestionsQuery = this.questionsRepository.findByTitleAndCategoryId(title, doctorId, categoryId, {
      startAtCyrillic: true,
    });
    const otherQuestionsQuery = this.questionsRepository.findByTitleAndCategoryId(title, doctorId, categoryId, {
      startAtCyrillic: false,
    });

    const questions = await Promise.all([
      cyrillicQuestionsQuery,
      otherQuestionsQuery,
    ]).then(([cyrillicQuestions, otherQuestions]) => [...cyrillicQuestions, ...otherQuestions]);

    return questions.map((question) => {
      const { type } = question;
      if (type === QuestionType.PRESSURE || type === QuestionType.TEMPERATURE) {
        question.indicators = new QuestionIndicators();
      }
      if (type === QuestionType.PRESSURE) question.indicators.pressure = TemperatureAndPressureIndicators[type];
      if (type === QuestionType.TEMPERATURE) question.indicators.temperature = TemperatureAndPressureIndicators[type];
      return question;
    });
  }

  async findById(id: string): Promise<Question> {
    return this.questionsRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async createCustomQuestion(doctorId: string, input: CreateCustomQuestionInput) {
    const { title, type, options, scaleIndicators } = input;

    if (type == 'radio' || type == 'checkbox') {
      const question = await this.questionsRepository.save({
        title,
        type,
        doctorId,
        isCustom: true,
      });
      const questionOptions = options.map((option, index) => {
        return this.questionOptionsRepository.create({
          text: option,
          index: index,
          questionId: question.id,
        });
      });
      await this.questionOptionsRepository.save(questionOptions);
      return question;
    }
    if (type == 'numeric') {
      return this.questionsRepository.save({
        title,
        type,
        doctorId,
        isCustom: true,
      });
    }
    if (type == 'scale') {
      return this.questionsRepository.save({
        title,
        type,
        indicators: {
          scale: scaleIndicators,
        },
        doctorId,
        isCustom: true,
      });
    }
  }
}
