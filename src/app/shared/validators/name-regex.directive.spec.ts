import {nameRegexValidator, nameRegexCrawlerNameValidator, NAME_REGEX, NAME_CRAWLER_REGEX} from './name-regex.directive';
import { FormControl } from '@angular/forms';

describe('Name and Crawler Name RegexValidators', () => {

    it('should be valid name', () => {
        const result = NAME_REGEX.test('aA0 _.');
        expect(result).toBeTrue();
    });

    it('should be invalid name containing special character $', () => {
        const result = NAME_REGEX.test('aA0 _.$');
        expect(result).toBeFalse();
    });

    it('should be invalid name containing greek letter', () => {
        const result = NAME_REGEX.test('aA0 _.Γ');
        expect(result).toBeFalse();
    });

    it('should be valid Crawler name', () => {
        const result = NAME_CRAWLER_REGEX.test('aA0_-');
        expect(result).toBeTrue();
    });

    it('should be valid Crawler name containing dash', () => {
        const result = NAME_CRAWLER_REGEX.test('abc-abc');
        expect(result).toBeTrue();
    });

    it('should be invalid Crawler name containing empty spaces', () => {
        const result = NAME_CRAWLER_REGEX.test('abc abc');
        expect(result).toBeFalse();
    });

    it('should be invalid Crawler name containing dots in name', () => {
        const result = NAME_CRAWLER_REGEX.test('abc.abc');
        expect(result).toBeFalse();
    });

    it('should be invalid Crawler name containing special character $', () => {
        const result = NAME_CRAWLER_REGEX.test('aA0_-$');
        expect(result).toBeFalse();
    });

    it('should be invalid Crawler name containing russian letter', () => {
        const result = NAME_CRAWLER_REGEX.test('aA0_-ЙЪ');
        expect(result).toBeFalse();
    });

    it('should return null when value is a valid name', () => {
        let formControl = new FormControl();
        formControl.setValue('aA0 _.');
        const result = nameRegexValidator()(formControl);
        expect(result).toBeNull();
    });

    it(' nameRegexValidator should return name when value is not a valid name', () => {
        let formControl = new FormControl();
        let name = 'aA0 _.$';
        formControl.setValue(name);
        const result = nameRegexValidator()(formControl);
        expect(result).toEqual({ forbiddenName: { value: name } });
    });

    it('nameRegexCrawlerNameValidator should return null when value is a valid name', () => {
        let formControl = new FormControl();
        formControl.setValue('aA0_-');
        const result = nameRegexCrawlerNameValidator()(formControl);
        expect(result).toBeNull();
    });

    it(' nameRegexCrawlerNameValidator should return name when value is not a valid name', () => {
        let formControl = new FormControl();
        let name = 'aA0_-$';
        formControl.setValue(name);
        let result = nameRegexCrawlerNameValidator()(formControl);
        expect(result).toEqual({ forbiddenName: { value: name } });

        name = 'aA0_- ';
        formControl.setValue(name);
        result = nameRegexCrawlerNameValidator()(formControl);
        expect(result).toEqual({ forbiddenName: { value: name } });

        name = 'aA0_-.';
        formControl.setValue(name);
        result = nameRegexCrawlerNameValidator()(formControl);
        expect(result).toEqual({ forbiddenName: { value: name } });
    });
});
