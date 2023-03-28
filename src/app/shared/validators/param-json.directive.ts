import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function paramJsonValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value) {
            try {
                JSON.parse(control.value);
                return null;
            } catch (e) {
                return { jsonInvalid: true };
            }
        }

        return { jsonInvalid: true };
    };
}
