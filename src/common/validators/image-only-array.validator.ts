import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isImage } from 'src/utils';

@ValidatorConstraint({ name: 'ImagesArrayValidator', async: false })
export class ImagesArrayValidator implements ValidatorConstraintInterface {
  validate(urls: string[]) {
    return urls.reduce((isValid, url): boolean => {
      if (!isImage(url)) {
        isValid = false;
      }
      return isValid;
    }, true);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} has invalid extension`;
  }
}
