import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { UserPasswordInput } from '../inputs';

@Injectable()
export class ValidPasswordPipe implements PipeTransform {
  transform(input: UserPasswordInput) {
    const valid = input.password.indexOf(' ') < 0;
    if (!valid) {
      throw new BadRequestException('Неверный формат пароля');
    }
    return input;
  }
}
