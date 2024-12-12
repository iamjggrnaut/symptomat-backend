import { Field, ObjectType } from '@nestjs/graphql';

import { QuestionCategory } from '../question-category.entity';

@ObjectType()
export class QuestionCategoryModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  private constructor(data: Partial<QuestionCategory>) {
    Object.assign(this, data);
  }

  static create(props: Partial<QuestionCategory>): QuestionCategoryModel {
    return new QuestionCategoryModel(props);
  }
}
