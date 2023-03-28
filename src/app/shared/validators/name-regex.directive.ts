import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export const NAME_REGEX = new RegExp('^(?=.*[a-zA-Z\\d].*)[a-zA-Z\\d _.]+$');

export const NAME_CRAWLER_REGEX = new RegExp('^(?=.*[a-zA-Z\\d].*)[a-zA-Z\\d_-]+$');

export function nameRegexValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const result = NAME_REGEX.test(control.value);
        return result ? null : { forbiddenName: { value: control.value } };
    };
}

export function nameRegexCrawlerNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const result = NAME_CRAWLER_REGEX.test(control.value);
        return result ? null : { forbiddenName: { value: control.value } };
    };
}
