import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { Language } from '../types/users.types';

@InputType()
export class UserUpdateLanguageInput {
  @IsNotEmpty()
  @Field(() => Language, { defaultValue: Language.RU })
  language: Language;
}
