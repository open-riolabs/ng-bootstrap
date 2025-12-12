import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const startControl = group.get('start');
  const endControl = group.get('end');

  if (!startControl || !endControl || !startControl.value || !endControl.value) {
    return null;
  }

  const start = startControl.value.timestamp;
  const end = endControl.value.timestamp

  if (end < start) {
    startControl.setErrors({ invalidDateRange: true })
    endControl.setErrors({ invalidDateRange: true })
    return { invalidDateRange: true };
  }

  startControl.setErrors(null);
  endControl.setErrors(null);
  return null;
};
