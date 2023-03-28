import { windowSizeValidator, WINDOW_SIZE_REGEX } from './window-size.directive';
import { FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

describe('windowSizeValidator', () => {

    it('should be valid window size', () => {
        const result = WINDOW_SIZE_REGEX.test('1920,1080');
        expect(result).toBeTrue();
    });

    it('should be invalid when invalid window using large numbers', () => {
        const result = WINDOW_SIZE_REGEX.test('1920:108099');
        expect(result).toBeFalse();
    });

    it('should be invalid when invalid window using short numbers', () => {
        const result = WINDOW_SIZE_REGEX.test('1920:1');
        expect(result).toBeFalse();
    });

    it('should return null when valid window size', () => {
        let formControl = new FormControl();
        formControl.setValue('1920,1080');

        const result = windowSizeValidator()(formControl);

        expect(result).toBeNull();
    });

    it('should return not null when invalid window size', () => {
        let formControl = new FormControl();
        let dimensions = '112983w093409';
        formControl.setValue(dimensions);

        const result = windowSizeValidator()(formControl);

        expect(result).toEqual({ forbiddenWindowSize: { value: dimensions } });
    });

});
