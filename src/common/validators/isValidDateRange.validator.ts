import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
@ValidatorConstraint({ name: 'isValidDateRange', async: false })
export class IsValidDateRange implements ValidatorConstraintInterface {
  validate(end_date: Date, args: ValidationArguments) {
    const currentDate = new Date();
    const object = args.object as any;
    const start_date = object.start_date;

    if (!start_date || !end_date) return false;

    if (start_date.getTime() <= currentDate.getTime()) return false;
    if (end_date.getTime() <= currentDate.getTime()) return false;

    const startDateOnly = new Date(start_date);
    startDateOnly.setHours(0, 0, 0, 0);

    const endDateOnly = new Date(end_date);
    endDateOnly.setHours(0, 0, 0, 0);

    if (startDateOnly.getTime() === endDateOnly.getTime()) return false;

    if (end_date.getTime() <= start_date.getTime()) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'End Date must be a future date, greater than start date, and not on the same day as start date.';
  }
}
