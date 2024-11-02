import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isFullDateString', async: false })
export class IsFullDateStringConstraint implements ValidatorConstraintInterface {
  validate(dateString: string) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z?$/; // Matches ISO 8601 with seconds
    return typeof dateString === 'string' && isoDateRegex.test(dateString);
  }

  defaultMessage() {
    return 'Must be a valid ISO date string with seconds (e.g., "2024-11-01T16:00:00Z").';
  }
}

export function IsFullDateString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFullDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsFullDateStringConstraint,
    });
  };
}
