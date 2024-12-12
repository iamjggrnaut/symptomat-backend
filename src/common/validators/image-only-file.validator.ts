import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isImage } from 'src/utils';

@ValidatorConstraint({ name: 'ImageOnlyFileValidator', async: false })
export class ImageOnlyFileValidator implements ValidatorConstraintInterface {
  validate(filename: string) {
    return isImage(filename);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} has invalid extension`;
  }
}
