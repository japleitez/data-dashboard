import { SimpleChange } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FiltersFormComponent } from './filters-form.component';
import {
    FiltersFormUrlData,
    JsonFormName,
    JsonFormType,
    JsonFormParameter, JsonFilterHelp
} from '../model/url-filter-form.model';
import { TranslateModule } from '@ngx-translate/core';

function getTestFiltersFormUrlData(id: string): FiltersFormUrlData {
    return {
        'id': id,
        'name': getTestJsonFormName(id),
        'help': getTestJsonFilterHelp(),
        'parameters': [
            getTestJsonFormParameter(id, 'boolean'),
            getTestJsonFormParameter(id + '1', 'string'),
            getTestJsonFormParameter(id + '1', 'number'),
            getTestJsonFormParameterArray(id + '2')
        ]
    };
}

function getTestJsonFilterHelp(): JsonFilterHelp {
    return { default: 'fake help text' };
}

function getTestJsonFormName(id: string): JsonFormName {
    return { default: id, translationKey: 'translationKey_' + id };
}

function getTestJsonFormParameter(id: string, typeName: string): JsonFormParameter {
    return { 'id': id, 'name': getTestJsonFormName(id), 'help': getTestJsonFilterHelp(), type: getTestJsonFormType(typeName) };
}

function getTestJsonFormParameterArray(id: string): JsonFormParameter {
    return { 'id': 'array_id', 'name': getTestJsonFormName(id), 'help': getTestJsonFilterHelp(), type: getTestJsonFormTypeArray() };
}

function getTestJsonFormTypeArray(): JsonFormType {
    return {
        type: 'array',
        required: true,
        arrayType: 'string',
        pattern: '^[a-zA-Z]*$',
        minArrayLength: 5,
        maxArrayLength: 10
    };
}

function getTestJsonFormType(typeName: string): JsonFormType {
    switch (typeName) {
        case 'boolean':
            return { type: typeName, required: false };
        case 'string':
            return { type: typeName, required: true, minLength: 4, maxLength: 10 };
        case 'number':
            return { type: typeName, required: true, minimum: 4, maximum: 10 };
        default:
            return { type: typeName, required: true };
    }
}

describe('FiltersUrl Form Component Test ', () => {
    let component: FiltersFormComponent;
    let fixture: ComponentFixture<FiltersFormComponent>;
    const formBuilder: FormBuilder = new FormBuilder();
    const locationStub = {back: jasmine.createSpy('back')};

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FiltersFormComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                { provide: Location, useValue: locationStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FiltersFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create FiltersUrlForm Component ', () => {
        expect(component).toBeTruthy();
        expect(component.defaultFilterName).not.toBeNull();
    });

    it('should convert multiline string to array ', () => {
        expect(component.convertToArray('array_id').length).toEqual(1);
        expect(component.convertToArray('').length).toEqual(0);
        expect(component.convertToArray('1 \r\n 2 \r\n 3').length).toEqual(3);
        expect(component.convertToArray('1\r\n2\r\n3').includes('1')).toBeTrue();
        expect(component.convertToArray('1\r\n2\r\n3').includes('2')).toBeTrue();
        expect(component.convertToArray('1\r\n2\r\n3').includes('3')).toBeTrue();
    });

    it(' should return undefined if values are not set', () => {
        expect(component.getValues('test', ) ).toBeUndefined();
    });

    it(' method getValues  should return values by id ', () => {
        component.values = {"test": [{"id" : "id_arr_0"}]};
        expect(component.getValues('test' )[0].id ).toEqual('id_arr_0');
    });

    it('on Cancel should back ', () => {
        component.formUrlFilterConfig = formBuilder.group({});
        component.jsonFormUrlData = getTestFiltersFormUrlData('test_one');
        component.ngOnChanges({'jsonFormUrlData': new SimpleChange('', '', false)});
        component.onCancel({});
        expect(locationStub.back).not.toBeNull();
    });

});
