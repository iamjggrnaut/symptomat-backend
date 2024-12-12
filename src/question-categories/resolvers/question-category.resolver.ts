import { Resolver } from '@nestjs/graphql';

import { QuestionCategoryModel } from '../models/question-category.model';

@Resolver(() => QuestionCategoryModel)
export class QuestionCategoryResolver {}
