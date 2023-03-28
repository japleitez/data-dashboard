import { FormBuilder } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MetadataFormComponent } from './metadata-form.component';
import { JsonFormKeyValues, MetadataFormData } from '../model/metadata-form-model';
import { SimpleChange } from '@angular/core';

function createMetadataFormData(): MetadataFormData {
    let data: JsonFormKeyValues = { key: '', values: ['', '', ''] };
    return { id: '1', data: data };
}

describe('MetadataFormComponent Test', () => {
    let component: MetadataFormComponent;
    let fixture: ComponentFixture<MetadataFormComponent>;
    const formBuilder: FormBuilder = new FormBuilder();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                MetadataFormComponent
            ],
            providers: [
                { provide: FormBuilder, useValue: formBuilder }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MetadataFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component ', () => {
        expect(component).toBeTruthy();
        expect(component.metadataFormGroup).not.toBeNull();
    });

    it('should create component initialized with 3 values ', () => {
        component.metadata = createMetadataFormData();
        component.ngOnChanges({ 'metadata': new SimpleChange('', '', false) });
        expect(component).toBeTruthy();
        expect(component.metadataFormGroup).not.toBeNull();
        expect(component.getFormArrayControls().length).toEqual(3);
    });

    it('can add value ', () => {
        component.metadata = createMetadataFormData();
        component.ngOnChanges({ 'metadata': new SimpleChange('', '', false) });

        expect(component.getFormArray('values').length).toEqual(3);

        component.addValue();
        expect(component.getFormArray('values').length).toEqual(4);
    });

    it('can remove value ', () => {
        component.metadata = createMetadataFormData();
        component.ngOnChanges({ 'metadata': new SimpleChange('', '', false) });

        expect(component.getFormArray('values').length).toEqual(3);

        component.removeValue(2);
        expect(component.getFormArray('values').length).toEqual(2);
        expect(component.hasValues()).toBeTrue();
        expect(component.getMetadataId()).toEqual('1');

    });

    it('can return metadata id', () => {
        expect(component.getMetadataId()).toEqual('none');
        component.metadata = createMetadataFormData();
        expect(component.getMetadataId()).toEqual('1');
    });

});
