import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidTimeRange', async: false })
export class IsValidDateRange implements ValidatorConstraintInterface {
  validate(end_date: Date, args: ValidationArguments) {
    const currentDate = new Date();
    const object = args.object as any;
    const start_date = object.start_date;
    if (!start_date || !end_date) return false;

    if (start_date.getTime() <= currentDate.getTime()) return false;

    // Ensure end_time is greater than start_time
    if (end_date.getTime() <= start_date.getTime()) return false;

    // Ensure both times are on the same date
    const startDate = start_date.toISOString().split('T')[0];
    const endDate = end_date.toISOString().split('T')[0];
    console.log(start_date.getTime());
    console.log(end_date.getTime());
    console.log(currentDate.getTime());

    return startDate === endDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'End time must be greater than start time, on the same date, and not the same time.';
  }
}
