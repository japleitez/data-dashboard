import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CoreModule } from '../../../../core/core.module';
import { PlayDetailsComponent } from './play.details.component';
import { UxAppShellService } from '@eui/core';
import { Observable, of } from 'rxjs';
import { PlaygroundService, UrlFilterArrayResponseType } from '../../shared/service/playground.service';
import { HttpResponse } from '@angular/common/http';
import { UrlFilter } from '../../../../shared/components/model/url-filter.model';
import { FiltersUrlTestResultData } from '../../../../shared/components/model/url-filter-test-result.model';
import { FiltersFormUrlData, JsonFilterHelp } from '../../../../shared/components/model/url-filter-form.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FiltersParseTestResultData } from '../../../../shared/components/model/parse-filter-test-result.model';
import {
    FiltersNavigationTestResultData
} from "../../../../shared/components/model/navigation-filter-test-result.model";

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

class PlaygroundServiceMock {

    getUrlFilters(req: any): Observable<UrlFilterArrayResponseType> {
        let urlFilterList: UrlFilter[] = [getTestUrlFilter('one'), getTestUrlFilter('two')];
        return of(new HttpResponse({status: 200, body: urlFilterList}));
    }

    getParseFilters(req: any): Observable<UrlFilterArrayResponseType> {
        let urlFilterList: UrlFilter[] = [getTestUrlFilter('two'), getTestUrlFilter('two')];
        return of(new HttpResponse({status: 200, body: urlFilterList}));
    }

    getNavigationFilters(req: any): Observable<UrlFilterArrayResponseType> {
        let urlFilterList: UrlFilter[] = [getTestUrlFilter('three'), getTestUrlFilter('three')];
        return of(new HttpResponse({status: 200, body: urlFilterList}));
    }

    getUrlFilter(filterId: string): Observable<FiltersFormUrlData> {
        return of(getTestFiltersFormUrlData(filterId));
    }

    getParseFilter(filterId: string): Observable<FiltersFormUrlData> {
        return of(getTestFiltersFormUrlData(filterId));
    }

    getNavigationFilter(filterId: string): Observable<FiltersFormUrlData> {
        return of(getTestFiltersFormUrlData(filterId));
    }


    testUrlFilter(filterId: string, filterValues: any): Observable<FiltersUrlTestResultData> {
        return of(getTestFiltersTestResultData(filterId));
    }

    testParseFilter(filterId: string, filterValues: any): Observable<FiltersParseTestResultData> {
        return of(getTestParseFiltersTestResultData(filterId));
    }

    testNavigationFilter(filterId: string, filterValues: any): Observable<FiltersNavigationTestResultData> {
        return of({
            steps: [
                {
                    'action': 'input',
                    'xpath': '//title',
                    'value': 'my test',
                    'highlight': true,
                    'screenshot': null,
                    'error': null
                },
                {
                    'action': 'click',
                    'xpath': '//button',
                    'value': null,
                    'highlight': false,
                    'screenshot': null,
                    'error': 'ElementNotFoundException'
                }
            ]
        });
    }
}

function getTestJsonFilterHelp(): JsonFilterHelp {
    return { default: 'fake help text' };
}

function getTestFiltersTestResultData(id: string): FiltersUrlTestResultData {
    return {urls: [{url: 'url_' + id, result: true}, {url: 'url_2_' + id, result: false}]};
}

function getTestParseFiltersTestResultData(id: string): FiltersParseTestResultData {
    const parseTestRes = new Map<string, string[]>();
    parseTestRes.set('fruit', ['apple', 'banana']);
    parseTestRes.set('vine', ['red', 'white']);
    return parseTestRes;
}

function getTestUrlFilter(id: string): UrlFilter {
    return {'id': id, 'name': {'default': 'default name _' + id, 'translationKey': 'translationKey_' + id}};
}

function getTestFiltersFormUrlData(id: string) {
    return {
        'id': id,
        'name': getTestJsonFormName(id),
        'help': getTestJsonFilterHelp(),
        'parameters': [getTestJsonFormParameter(id), getTestJsonFormParameter(id + '1')]
    };
}

function getTestJsonFormParameter(id: string) {
    return {'id': 'parameter_id_' + id, 'name': getTestJsonFormName(id), 'help': getTestJsonFilterHelp(), type: getTestJsonFormType(id)};
}

function getTestJsonFormName(id: string) {
    return {default: 'default_' + id, translationKey: 'translationKey_' + id};
}

function getTestJsonFormType(id: string) {
    return {type: 'type' + id, required: true, pattern: 'pattern' + id};
}

function getTestFormGroup(id: string, isValid: boolean) {
    if (isValid) {
        return new FormGroup({
            id: new FormControl(id, Validators.required),
            vv: new FormControl('xx', Validators.required)
        });
    } else {
        return new FormGroup({
            id: new FormControl(id, Validators.required),
            vv: new FormControl(null, Validators.required)
        });
    }
}

describe('PlaygroundDetailsComponent for existing UrlFilter', () => {
    let component: PlayDetailsComponent;
    let fixture: ComponentFixture<PlayDetailsComponent>;

    const formBuilder: FormBuilder = new FormBuilder();
    const locationStub = {back: jasmine.createSpy('back')};
    const activatedRouteMock = {
        snapshot: {
            params: {
                name: 'fakeName',
                id: 'test.filter.name',
                type: 'urlFilter'
            }
        }
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                PlayDetailsComponent
            ],
            imports: [
                CoreModule,
            ],
            providers: [
                {provide: UxAppShellService, useClass: UxAppShellServiceMock},
                {provide: ActivatedRoute, useValue: activatedRouteMock},
                {provide: Location, useValue: locationStub},
                {provide: PlaygroundService, useClass: PlaygroundServiceMock},
                {provide: FormBuilder, useValue: formBuilder},
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create URL Details form', () => {
        component.currentType = 'urlFilter';
        expect(component).toBeTruthy();
        expect(component.currentId).toEqual('test.filter.name');
        expect(component.filtersFormUrlData.id).toEqual('test.filter.name');
    });

    it('should create PARSE Details form', () => {
        component.currentType = 'parseFilter';
        expect(component).toBeTruthy();
        expect(component.currentId).toEqual('test.filter.name');
        expect(component.filtersFormUrlData.id).toEqual('test.filter.name');
    });

    it('should create NAVIGATION Details form', () => {
        component.currentType = 'navigationFilter';
        expect(component).toBeTruthy();
        expect(component.currentId).toEqual('test.filter.name');
        expect(component.filtersFormUrlData.id).toEqual('test.filter.name');
    });

    it(' should submit NAVIGATION data', () => {
        component.currentType = 'navigationFilter';
        expect(component).toBeTruthy();
        expect(component.formUrlFilterFormGroup.value.protocol).toBeUndefined();
        component.testUrlList = 'testUrl';

        component.submitNavigationFilter();

        expect(component.currentId).toEqual('test.filter.name');
        expect(component.filtersFormUrlData.id).toEqual('test.filter.name');
        expect(component.navigationTestUrl).toEqual('testUrl');
        expect(component.isErrorNavigationFilterReportVisible).toBeTrue();
        expect(component.formUrlFilterFormGroup.value.protocol).toEqual('STATIC');
        expect(component.formUrlFilterFormGroup.value.id).toEqual('test.filter.name');
    });

    it(' should submit PARSE data', () => {
        component.currentType = 'parseFilter';
        expect(component).toBeTruthy();
        expect(component.formUrlFilterFormGroup.value.protocol).toBeUndefined();
        component.testUrlList = 'testUrl';

        component.submitParseFilter();

        expect(component.currentId).toEqual('test.filter.name');
        expect(component.filtersFormUrlData.id).toEqual('test.filter.name');
        expect(component.parseTestUrl).toEqual('testUrl');
        expect(component.isErrorParseFilterReportVisible).toBeTrue();
        expect(component.formUrlFilterFormGroup.value.protocol).toEqual('STATIC');
        expect(component.formUrlFilterFormGroup.value.id).toEqual('test.filter.name');
    });

    it(' should submit URL data', () => {
        component.currentType = 'parseFilter';
        expect(component).toBeTruthy();
        expect(component.formUrlFilterFormGroup.value.protocol).toBeUndefined();
        component.testUrlList = 'testUrl';

        component.submitUrlFilter();

        expect(component.currentId).toEqual('test.filter.name');
        expect(component.filtersFormUrlData.id).toEqual('test.filter.name');
        expect(component.parseTestUrl).toEqual('');
        expect(component.isErrorParseFilterReportVisible).toBeFalse();
        expect(component.isErrorFilterReportVisible).toBeTrue();
        expect(component.formUrlFilterFormGroup.value.protocol).toBeUndefined();
        expect(component.formUrlFilterFormGroup.value.id).toEqual('test.filter.name');
    });

    it('should renderer validation result ', () => {
        expect(component).toBeTruthy();
        let ddd;
        expect(component.rendererValidationResult(true)).toEqual('PASS');
        expect(component.rendererValidationResult(false)).toEqual('FAIL');
        expect(component.rendererValidationResult(null)).toEqual('INVALID');
        expect(component.rendererValidationResult(ddd)).toEqual('INVALID');
    });

    it('should calculate filter name ', () => {
        component.currentType = 'urlFilter';
        expect(component.calculateFilterName()).toEqual('URL');

        component.currentType = 'parseFilter';
        expect(component.calculateFilterName()).toEqual('PARSE');

        component.currentType = 'navigationFilter';
        expect(component.calculateFilterName()).toEqual('NAVIGATION');

        component.currentType = <any>'aaaa';
        expect(component.calculateFilterName()).toEqual('');

        component.currentType = null;
        expect(component.calculateFilterName()).toEqual('');
    });

    it('should convert string to array ', () => {
        expect(component.asArray('abc')[0]).toEqual('abc');
        expect(component.asArray(['abc'])[0]).toEqual('abc');
        expect(component.asArray(['abc', 'def'])[0]).toEqual('abc');
        expect(component.asArray(['abc', 'def'])[1]).toEqual('def');
    });

    it('convert strings to array ', () => {
        expect(component.convertToArray('array_id').length).toEqual(1);
        expect(component.convertToArray('').length).toEqual(0);
        expect(component.convertToArray('11 \r\n 32 \r\n 3234').length).toEqual(3);
        expect(component.convertToArray('14\r\n22\r\n33').includes('14')).toBeTrue();
        expect(component.convertToArray('14\r\n22\r\n33').includes('22')).toBeTrue();
        expect(component.convertToArray('14\r\n22\r\n33').includes('33')).toBeTrue();
    });

    it('on Cancel should back ', () => {
        component.ngOnInit();
        component.onCancel({});
        expect(locationStub.back);
    });

    it('can load PARSE filters ', () => {
        component.currentType = 'parseFilter';
        component.loadFilterData();
        expect(component.filtersFormUrlData).not.toBeNull();
    });

    it('can load NAVIGATION filters ', () => {
        component.currentType = 'navigationFilter';
        component.loadFilterData();
        expect(component.filtersFormUrlData).not.toBeNull();
    });

    it('buildMetaDataValues  ', () => {
        component.currentType = 'parseFilter';
        component._buildForm();

        const controlArray: FormControl[] = [];
        for (let i = 0; i < 10; i++) {
            controlArray[i] = formBuilder.control('_' + i);
        }

        let metadataFormGroup: FormGroup = formBuilder.group({});
        metadataFormGroup.addControl('key', formBuilder.control('key'));
        metadataFormGroup.addControl('values', formBuilder.array(controlArray));

        component.getFormArray('metadata').push(metadataFormGroup);

        let mdList = component.buildMetaDataValues();
        expect(mdList['key'][9]).toEqual('_9');
    });

});
