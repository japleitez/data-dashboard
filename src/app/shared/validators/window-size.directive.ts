import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export const WINDOW_SIZE_REGEX = new RegExp('^[0-9]{2,4}(?:,[0-9]{2,4})?$');

export function windowSizeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const result = WINDOW_SIZE_REGEX.test(control.value);
        return result ? null : { forbiddenWindowSize: { value: control.value } };
    };
}
