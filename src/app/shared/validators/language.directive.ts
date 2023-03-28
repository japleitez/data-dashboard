import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export const LANGUAGE_REGEX = new RegExp('^[a-z]{2}(?:-[a-zA-Z]{2})?$');

export function languageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const result = LANGUAGE_REGEX.test(control.value);
        return result ? null : { forbiddenLanguage: { value: control.value } };
    };
}
