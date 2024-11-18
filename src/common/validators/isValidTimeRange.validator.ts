import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTimeRangeValid', async: false })
export class IsValidTimeRange implements ValidatorConstraintInterface {
  validate(end_time: string, args: ValidationArguments) {
    const object = args.object as any;
    const start_time = object.start_time;

    if (!start_time || !end_time) return false;

    const start = new Date(`1970-01-01T${start_time}Z`);
    const end = new Date(`1970-01-01T${end_time}Z`);

    // Ensure end_time is greater than start_time
    return end.getTime() > start.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    return 'End time must be greater than start time.';
  }
}
