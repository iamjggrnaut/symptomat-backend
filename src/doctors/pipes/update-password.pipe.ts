import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { DoctorPasswordUpdateInput } from 'src/doctors/inputs';

@Injectable()
export class UpdatePasswordPipe implements PipeTransform {
  transform(input: DoctorPasswordUpdateInput) {
    const valid = input.newPassword.indexOf(' ') < 0;
    if (!valid) {
      throw new BadRequestException('Неверный формат пароля');
    }
    return input;
  }
}
