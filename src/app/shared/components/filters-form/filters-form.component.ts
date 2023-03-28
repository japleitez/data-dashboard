import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { FiltersFormUrlData } from '../model/url-filter-form.model';

@Component({
    selector: 'app-filters-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './filters-form.component.html',
})

export class FiltersFormComponent implements OnChanges {

    @Input() jsonFormUrlData: FiltersFormUrlData;
    @Input() public formUrlFilterConfig: FormGroup;
    @Input() public values: any;

    public defaultFilterName = '';
    public defaultFilterHelp = '';
    public translationKeyFilter = '';

    constructor(private fb: FormBuilder, private location: Location) {
    }

    public getValues(objectId: string) {
        if (this.values === undefined) {
            return;
        }
        return this.values[objectId];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.jsonFormUrlData !== undefined) {
            this.createFormHeader(this.jsonFormUrlData);
        }
    }

    createFormHeader(filters: FiltersFormUrlData) {
        this.defaultFilterName = filters.name.default;
        this.translationKeyFilter = filters.name.translationKey;
        this.formUrlFilterConfig.addControl('id', this.fb.control(filters.id));
        this.defaultFilterHelp = filters.help?.default;
    }

    convertToArray(input: string) {
        if ('' !== input) {
            return input.split(/\r?\n/).filter(String);
        }
        return [];
    }

    onCancel(event: any): void {
        this.location.back();
    }
}
