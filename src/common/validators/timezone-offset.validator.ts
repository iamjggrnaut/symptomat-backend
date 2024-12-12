import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { timezoneOffsets } from 'src/utils';

@ValidatorConstraint({ name: 'TimezoneOffsetValidator', async: false })
export class TimezoneOffsetValidator implements ValidatorConstraintInterface {
  validate(inputTimezoneOffset: number) {
    return timezoneOffsets.includes(inputTimezoneOffset);
  }

  defaultMessage(args: ValidationArguments) {
    return `Timezone offset ${args.value} not supported`;
  }
}
