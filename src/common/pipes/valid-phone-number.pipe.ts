import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMobilePhone } from 'class-validator';

@Injectable()
export class ValidPhoneNumberPipe implements PipeTransform {
  transform(phone: string) {
    const valid = isMobilePhone(phone);
    if (!valid) {
      throw new BadRequestException(`Invalid phone ${phone}`);
    }
    return phone;
  }
}
