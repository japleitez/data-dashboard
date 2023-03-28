import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FiltersFormElementComponent } from './filters-form-element.component';
import { JsonFormName, JsonFormType, JsonFormParameter, JsonFilterHelp } from '../model/url-filter-form.model';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleChange } from '@angular/core';
import { UxAppShellService } from '@eui/core';

let msgError: string;

class UxAppShellServiceMock {
    state$ = of(null);
    breakpoints$ = of({
        isMobile: false
    });

    growlError(msg: string): void {
        msgError = msg;
        expect(msg).not.toBeNull();
    }

    growlSuccess(msg: string): void {
        expect(msg).not.toBeNull();
    }
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
    return { 'id': 'array_id', 'name': getTestJsonFormName(id), 'help': getTestJsonFilterHelp(), type: getTestJsonFormTypeArray(id) };
}

function getTestJsonFormTypeArray(id: string): JsonFormType {
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
        case 'object':
            return { type: typeName, required: true, parameters: [getTestJsonFormParameter('first', 'boolean'), getTestJsonFormParameter('second', 'string')] };
        default:
            return { type: typeName, required: true };
    }
}

describe('FiltersUrl Form Component Test ', () => {
    let component: FiltersFormElementComponent;
    let fixture: ComponentFixture<FiltersFormElementComponent>;
    const formBuilder: FormBuilder = new FormBuilder();
    const locationStub = { back: jasmine.createSpy('back') };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FiltersFormElementComponent],
            imports: [ReactiveFormsModule, TranslateModule.forRoot()],
            providers: [
                { provide: UxAppShellService, useClass: UxAppShellServiceMock },
                { provide: FormBuilder, useValue: formBuilder }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FiltersFormElementComponent);
        component = fixture.componentInstance;
        component.formUrlFilterConfig = formBuilder.group({});
        fixture.detectChanges();
    });

    it('should create FiltersUrlFormElementComponent Component ', () => {
        expect(component).toBeTruthy();
        expect(component.paramObjId).toEqual('');
    });

    it(' getValuesArray should return undefined if values are not set', () => {
        expect(component.getValuesArray('test', 1) ).toBeUndefined();
    });

    it(' getValuesArray for object type should return array of values ', () => {
        component.param = getTestJsonFormParameter('test_1', 'object');
        component.values = { 'test': [{ 'id' : 'id_arr_0' }] };

        expect(component.getValuesArray('test', 0)[0].id).toEqual('id_arr_0');
    });

    it(' getValuesArray for string type should return values ', () => {
        component.param = getTestJsonFormParameter('test_1', 'string');
        component.values = [{ 'id' : 'id_arr_0' }, { 'id' : 'id_arr_1' }];
        expect(component.getValuesArray('test', 0).id).toEqual('id_arr_0');
        expect(component.getValuesArray('test', 1).id).toEqual('id_arr_1');
    });

    it(' getValues should return undefined if values are not set', () => {
        expect(component.getValues('test', ) ).toBeUndefined();
    });

    it(' getValues should return values by id ', () => {
        component.values = { 'test': [{ 'id' : 'id_arr_0' }] };
        expect(component.getValues('test' )[0].id ).toEqual('id_arr_0');
    });

    it(' getValues should return parent values by id ', () => {
        component.values = { 'test': [{ 'id' : 'id_arr_0' }] };
        expect(component.getValues('testNA' ).test[0].id ).toEqual('id_arr_0');
    });

    it(' getFormByID should return FormGroup  by id ', () => {
        let formGroup: FormGroup = formBuilder.group({});
        formGroup.addControl('test', formBuilder.group({}));
        component.formUrlFilterConfig = formGroup;
        expect(component.getFormByID('test' )).not.toBeNull();
    });

    it(' getFormByIDandIndex should return FormGroup by id and index ', () => {
        let formGArray: FormArray = formBuilder.array([formBuilder.group({}), formBuilder.group({})]);
        let formGroupM: FormGroup = formBuilder.group({});
        formGroupM.addControl('test', formGArray);
        component.formUrlFilterConfig = formGroupM;
        expect(component.getFormByIDandIndex('test', 1 )).not.toBeNull();
    });

    it(' getFormArrayControls returns form ', () => {
        component.createForm(getTestJsonFormParameterArray('123'));
        expect(component.getFormArrayControls('array_id').length).toEqual(5);
    });

    it(' isMaxNumberOfItems returns form ', () => {
        component.createForm(getTestJsonFormParameterArray('123'));
        let paramTst = getTestJsonFormParameterArray('123');
        paramTst.type.maxArrayLength = 10;
        expect(component.isMaxNumberOfItems(paramTst)).toBeFalse();
    });

    it(' isMinNumberOfItems returns form ', () => {
        component.createForm(getTestJsonFormParameterArray('123'));
        let paramTst = getTestJsonFormParameterArray('123');
        paramTst.type.minArrayLength = 2;
        expect(component.isMinNumberOfItems(paramTst)).toBeFalse();
    });

    it(' createForm with array ', () => {
        component.createForm(getTestJsonFormParameterArray('123'));
        expect(component.formUrlFilterConfig['controls']['array_id']['controls'].length).toEqual(5);
    });

    it(' createForm with object ', () => {
        component.createForm(getTestJsonFormParameter('456', 'object'));
        expect(component.formUrlFilterConfig['controls']['456']).not.toBeNull();
    });

    it(' createForm with string ', () => {
        component.createForm(getTestJsonFormParameter('789', 'string'));
        expect(component.formUrlFilterConfig['controls']['789']).not.toBeNull();
    });

    it(' can add array ', () => {
        component.createForm(getTestJsonFormParameterArray('123'));

        component.param = getTestJsonFormParameter('1', 'number');
        component.ngOnChanges({ 'jsonFormUrlData': new SimpleChange('', '', false) });

        let elementId = getTestJsonFormParameterArray('array_id').id;
        component.addToFormArray(getTestJsonFormParameterArray('array_id'));
        let initialArraySize = component.getFormArray(elementId).length;
        component.addToFormArray(getTestJsonFormParameterArray('array_id'));

        expect(component.getFormArray(elementId).length).toEqual(initialArraySize + 1);
    });

    it(' can not add more than maxArrayLength arrays ', () => {
        component.createForm(getTestJsonFormParameterArray('123'));

        component.param = getTestJsonFormParameter('1', 'number');

        component.ngOnChanges({ 'jsonFormUrlData': new SimpleChange('', '', false) });

        let maxArraysNumber = getTestJsonFormParameterArray('array_id').type.maxArrayLength;
        for (let i = 0; i < maxArraysNumber + 5; i++) {
            component.addToFormArray(getTestJsonFormParameterArray('array_id'));
        }
        let elementId = getTestJsonFormParameterArray('array_id').id;
        expect(component.getFormArray(elementId).length).toEqual(maxArraysNumber);
    });

    it(' getValueForFiled return empty string fo rundefined value ', () => {
        expect(component.values).toBeUndefined();
        expect(component.getValueForFiled('abc')).toEqual('');
    });

    it(' getValueForFiled return object if this object not array', () => {
        component.values = { test: 'testValue', test2: 'some string' };
        expect(component.values).not.toBeNull();
        expect(component.getValueForFiled('test').test).toEqual('testValue');
        expect(component.getValueForFiled('test').test2).toEqual('some string');
    });

    it(' getValueForFiled array item if this object is array', () => {
        component.values = [{ 'test': 'testValue1' }, { 'test': 'testValue2' }];
        expect(component.values).not.toBeNull();
        expect(component.getValueForFiled('1').test).toEqual('testValue2');
    });
});
