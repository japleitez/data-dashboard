import { languageValidator, LANGUAGE_REGEX } from './language.directive';
import { FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

describe('languageValidator', () => {

    it('should be valid language', () => {
        const result = LANGUAGE_REGEX.test('en');
        expect(result).toBeTrue();
    });

    it('should be valid language-region', () => {
        const result = LANGUAGE_REGEX.test('en-US');
        expect(result).toBeTrue();
    });

    it('should be invalid when region has more than 2 codes', () => {
        const result = LANGUAGE_REGEX.test('aa-AAAA');
        expect(result).toBeFalse();
    });

    it('should return null when valid language-region', () => {
        let formControl = new FormControl();
        formControl.setValue('en-US');

        const result = languageValidator()(formControl);

        expect(result).toBeNull();
    });

    it('should return not null when invalid language-region', () => {
        let formControl = new FormControl();
        let name = 'a$-A$';
        formControl.setValue(name);

        const result = languageValidator()(formControl);

        expect(result).toEqual({ forbiddenLanguage: { value: name } });
    });
});
