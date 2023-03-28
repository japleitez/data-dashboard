import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UxAppShellService } from '@eui/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { PlaygroundService } from '../../shared/service/playground.service';

import { FiltersUrlTestResultData } from '../../../../shared/components/model/url-filter-test-result.model';
import { FiltersParseTestResultData } from '../../../../shared/components/model/parse-filter-test-result.model';
import { FiltersFormUrlData } from '../../../../shared/components/model/url-filter-form.model';
import { JsonFormKeyValues, MetadataFormData } from '../../../../shared/components/model/metadata-form-model';
import { MetadataFormComponent } from '../../../../shared/components/metadata-form/metadata-form.component';
import { AppError } from '../../../../shared/alerts/alert-error.service';
import {
    FiltersNavigationTestResultData
} from '../../../../shared/components/model/navigation-filter-test-result.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    templateUrl: './play.details.component.html',
    styles: [`
        img {
            max-height: 600px;
            max-width: inherit;
            height: 70%;
            width: auto;
        }
    `]
})
export class PlayDetailsComponent implements OnInit {

    private static createMetadataFormData(idName): MetadataFormData {
        let data: JsonFormKeyValues = { key: '', values: [''] };
        let metadataForm: MetadataFormData = { id: idName, data: data };
        return metadataForm;
    }

    metadataForm: FormGroup;
    public formUrlFilterFormGroup: FormGroup = this.fb.group({});

    public metadataFormDataList: MetadataFormData[] = [];
    public filtersFormUrlData: FiltersFormUrlData;
    public isErrorFilterReportVisible = false;
    public errorList: { url: string; result: boolean }[];
    public filterName: string;
    public testUrlList: string = '';

    public testResultParseList: { prop: string; result: string[] }[];
    public isErrorParseFilterReportVisible = false;
    public parseTestUrl = '';

    public testResultNavigationList: {[key: string]: string | boolean | number }[];
    public testResultNavigationHeaders: string[];
    public isErrorNavigationFilterReportVisible = false;
    public navigationTestUrl = '';

    public seleniumProtocol = 'STATIC';
    readonly urlFilter = 'urlFilter';
    readonly parseFilter = 'parseFilter';
    readonly navigationFilter = 'navigationFilter';

    currentId: null;
    currentType: 'urlFilter' | 'parseFilter' | 'navigationFilter';

    constructor(
        private asService: UxAppShellService,
        private route: ActivatedRoute,
        private location: Location,
        private playgroundService: PlaygroundService,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        this._buildForm();
        this._getUrlFilterId();
        this.filterName = this.calculateFilterName();
        this.addMetadataEntrySet();
        this.loadFilterData();
    }

    loadFilterData() {
        switch (this.currentType) {
            case this.urlFilter:
                this.loadUrlFilterData();
                break;
            case this.parseFilter:
                this.loadParseFilterData();
                break;
            case this.navigationFilter:
                this.loadNavigationFilterData();
                break;
        }
    }

    loadUrlFilterData() {
        this.playgroundService.getUrlFilter(this.currentId)
            .subscribe((filtersFormUrlData_: FiltersFormUrlData) => {
                this.filtersFormUrlData = filtersFormUrlData_;
            });
    }

    loadParseFilterData() {
        this.playgroundService.getParseFilter(this.currentId)
            .subscribe((filtersFormUrlData_: FiltersFormUrlData) => {
                this.filtersFormUrlData = filtersFormUrlData_;
            });
    }

    rendererValidationResult(result: boolean) {
        if (result) {
            return 'PASS';
        } else if (result === undefined || result === null) {
            return 'INVALID';
        }
        return 'FAIL';
    }

    submitFiltersToTest() {
        if (!this.formUrlFilterFormGroup.valid) {
            this.asService.growlError('The Filter form is invalid, please fix the errors');
        } else {
            this.formUrlFilterFormGroup.value.metadata = this.buildMetaDataValues();
            switch (this.currentType) {
                case this.urlFilter:
                    this.submitUrlFilter();
                    break;
                case this.parseFilter:
                    this.submitParseFilter();
                    break;
                case this.navigationFilter:
                    this.submitNavigationFilter();
                    break;
            }
        }
    }

    submitUrlFilter() {
        this.formUrlFilterFormGroup.value.urls = this.convertToArray(this.testUrlList);
        this.playgroundService.testUrlFilter(this.formUrlFilterFormGroup.get('id').value, this.formUrlFilterFormGroup.value).subscribe(
            (testFilterRes: FiltersUrlTestResultData) => {
                this.errorList = testFilterRes.urls;
                this.isErrorFilterReportVisible = true;
            },
            error => {
                this.asService.growlError(<any>error);
            });
    }

    submitParseFilter() {
        this.testResultParseList = [];
        this.isErrorParseFilterReportVisible = false;
        this.formUrlFilterFormGroup.value.url = this.getFirstFromArray(this.testUrlList);
        this.formUrlFilterFormGroup.value.protocol = this.seleniumProtocol;
        this.parseTestUrl = this.formUrlFilterFormGroup.value.url;
        this.playgroundService.testParseFilter(this.formUrlFilterFormGroup.get('id').value, this.formUrlFilterFormGroup.value).subscribe(
            (testFilterRes: FiltersParseTestResultData) => {
                this.isErrorParseFilterReportVisible = true;
                Object.keys(testFilterRes).forEach(key => {
                    this.testResultParseList.push({ prop: key, result: this.asArray(testFilterRes[key]) });
                });
            },
            error => {
                this.asService.growlError(<any>error);
            });
    }

    submitNavigationFilter() {
        this.testResultNavigationList = [];
        this.isErrorNavigationFilterReportVisible = false;
        this.formUrlFilterFormGroup.value.url = this.getFirstFromArray(this.testUrlList);
        this.formUrlFilterFormGroup.value.protocol = this.seleniumProtocol;
        this.navigationTestUrl = this.formUrlFilterFormGroup.value.url;
        this.playgroundService.testNavigationFilter(this.formUrlFilterFormGroup.get('id').value, this.formUrlFilterFormGroup.value)
            .subscribe({
                next: (testFilterRes: FiltersNavigationTestResultData) => {
                    if (testFilterRes.steps) {
                        this.testResultNavigationList = testFilterRes.steps;
                        this.testResultNavigationHeaders = Object.keys(testFilterRes.steps[0]);
                    }
                    this.isErrorNavigationFilterReportVisible = true;
                },
                error: (error: AppError) => {
                    this.asService.growlError(error.detail);
                }
            });
    }

    formatNavigationFilterValue(val: any) {
        if (val === true || val === false) {
            return val ? 'Yes' : 'No';
        }
        return val;
    }

    sanitizeImage(base64: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64);
    }

    asArray(objArray: any) {
        if (Array.isArray(objArray)) {
            return objArray;
        }
        return [objArray];
    }

    isValidFormForTest() {
        return this.testUrlList?.trim().length > 0 && this.formUrlFilterFormGroup.valid;
    }

    convertToArray(input: string) {
        if ('' !== input) {
            return input.split(/\r?\n/).filter(String);
        }
        return [];
    }

    getFirstFromArray(input: string) {
        return this.convertToArray(input)[0];
    }

    buildMetaDataValues() {
        let mdList = {};
        this.metadataForm.value.metadata.forEach(md => {
            mdList[md.key] = md.values;
        });
        return mdList;
    }

    hasNotReachedMetadataMinSize(): boolean {
        return this.metadataFormDataList.length > 1;
    }

    addMetadataEntrySet() {
        let metadataId = 'key_' + this.metadataFormDataList.length;
        this.metadataFormDataList.push(PlayDetailsComponent.createMetadataFormData(metadataId));
    }

    removeMetadataEntrySet(metadata: MetadataFormData) {
        let index = -1;
        this.metadataFormDataList.forEach((metadataItem, i) => {
            if (metadataItem.id === metadata.id) {
                index = i;
                return;
            }
        });
        this.metadataFormDataList.splice(index, 1);
    }

    registerMetadataEntrySet(metadataFormComponent: MetadataFormComponent) {
        let metadataFormGroup: FormGroup = metadataFormComponent.metadataFormGroup;
        this.getFormArray('metadata').push(metadataFormGroup);
    }

    getFormArray(arrayId: string) {
        return this.metadataForm.get(arrayId) as FormArray;
    }

    onCancel(_event: any): void {
        this.location.back();
    }

    calculateFilterName() {
        switch (this.currentType) {
            case this.urlFilter:
                return 'URL';
            case this.parseFilter:
                return 'PARSE';
            case this.navigationFilter:
                return 'NAVIGATION';
            default:
                return '';
        }
    }

    public _buildForm() {
        this.metadataForm = this.fb.group({
            'metadata': this.fb.array([])
        });
    }

    private loadNavigationFilterData() {
        this.playgroundService.getNavigationFilter(this.currentId)
            .subscribe((filtersFormUrlData_: FiltersFormUrlData) => {
                this.filtersFormUrlData = filtersFormUrlData_;
            });

    }

    private _getUrlFilterId() {
        this.currentId = this.route.snapshot.params['id'];
        this.currentType = this.route.snapshot.params['type'];
    }

}
