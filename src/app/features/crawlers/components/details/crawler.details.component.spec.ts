import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CoreModule } from '../../../../core/core.module';
import { CrawlerDetailsComponent } from './crawler.details.component';
import { Crawler, CrawlerService } from '../../shared';
import { UxAppShellService } from '@eui/core';
import { Observable, of, throwError } from 'rxjs';
import { createTestCrawler } from '../../shared/models/crawlers.model';
import { AlertErrorService, AppError } from '../../../../shared/alerts/alert-error.service';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { EuiTabComponent } from '@eui/components/eui-tabs';
import { PaginationEvent } from '@eui/components/eui-table';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Source } from '../../../sources/shared';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlaygroundService, UrlFilterArrayResponseType } from '../../../playground/shared/service/playground.service';
import { UrlFilter } from '../../../../shared/components/model/url-filter.model';
import { RouterMock } from '../../../../shared/testing/router.mock';
import { FiltersFormUrlData, JsonFormParameter } from '../../../../shared/components/model/url-filter-form.model';
import { FiltersUrlTestResultData } from '../../../../shared/components/model/url-filter-test-result.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FiltersFormComponent } from '../../../../shared/components/filters-form/filters-form.component';
import { SourceArrayResponseType } from '../../shared/services/crawler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

class CrawlerServiceMock {
    getById(id: number): Observable<Crawler> {
        let item = createTestCrawler(id, 'crawler');
        return of(item);
    }

    saveCrawler(c: Crawler): Observable<Crawler> {
        c.id = 2;
        return of(c);
    }

    getCrawlerAndSources(id: number, req: any): Observable<any> {
        let item = createTestCrawler(id, 'crawler');
        const sourcesData = [{name: 'a', url: 'a'}, {name: 'b', url: 'b'}];
        const headers = new HttpHeaders();
        headers.set('X-Total-Count', '2');
        return of(item, new HttpResponse({status: 200, headers: headers, body: sourcesData}));
    }

    getSourcesForCrawler(crawlerId: number, req: any): Observable<HttpResponse<Source[]>> {
        let sourcesList: Source[] = [getTestSource(1), getTestSource(2)];
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('X-Total-Count', '2');
        return of(new HttpResponse({status: 200, headers: headers, body: sourcesList}));
    }
}

class LocalRouteMock extends RouterMock {
    public navigate =  jasmine.createSpy('navigate');
    public back = jasmine.createSpy('back');
}

class PlaygroundServiceMock {
    getUrlFilters(req: any): Observable<UrlFilterArrayResponseType> {
        let urlFilterList: UrlFilter[] = [getTestUrlFilter('one'), getTestUrlFilter('two')];
        return of(new HttpResponse({status: 200, body: urlFilterList}));
    }

    getParseFilters(req: any): Observable<UrlFilterArrayResponseType> {
        let urlFilterList: UrlFilter[] = [getTestUrlFilter('one'), getTestUrlFilter('two')];
        return of(new HttpResponse({status: 200, body: urlFilterList}));
    }

    getNavigationFilters(req: any): Observable<UrlFilterArrayResponseType> {
        let urlFilterList: UrlFilter[] = [getTestUrlFilter('one'), getTestUrlFilter('two')];
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

    testFilter(filterId: string, filterValues: any): Observable<FiltersUrlTestResultData> {
        return of(getTestFiltersTestResultData(filterId));
    }
}

function getTestFiltersTestResultData(id: string): FiltersUrlTestResultData {
    return {urls: [{url: 'url_' + id, result: true}, {url: 'url_2_' + id, result: false}]};
}

function getTestUrlFilter(id: string): UrlFilter {
    return {'id': id, 'name': {'default': 'default name _' + id, 'translationKey': 'translationKey_' + id}};
}

function getTestFiltersFormUrlData(id: string) {
    return {
        'id': id,
        'name': getTestJsonFormName(id),
        'parameters': [getTestJsonFormParameter(id), getTestJsonFormParameter(id + '1')]
    };
}

function getTestJsonFormParameter(id: string): JsonFormParameter {
    return {id: id, name: getTestJsonFormName(id), type: getTestJsonFormType(id)};
}

function getTestJsonFormName(id: string) {
    return {default: 'default_' + id, translationKey: 'translationKey_' + id};
}

function getTestJsonFormType(id: string) {
    return {type: 'array', required: true, pattern: 'pattern' + id};
}

class UxAppShellServiceMock {
    state$ = of(null);
    breakpoints$ = of({
        isMobile: false
    });

    growlError(msg: string): void {
        expect(msg).not.toBeNull();
    }

    growlSuccess(msg: string): void {
        expect(msg).not.toBeNull();
    }
}

class AlertErrorServiceMock {
    handleError(response: HttpErrorResponse): Observable<never> {
        return throwError(new AppError('danger', 'summary', 'detail'));
    }
}

function getTestSource(id: number): Source {
    return {id: id, name: 'source_' + id, url: 'https://source' + id + '.com'};
}

describe('CrawlersDetailsComponent for existing Crawler', () => {
    let component: CrawlerDetailsComponent;
    let fixture: ComponentFixture<CrawlerDetailsComponent>;
    const formBuilder: FormBuilder = new FormBuilder();
    const locationStub = {back: jasmine.createSpy('back')};
    const activatedRouteMock = {
        snapshot: {
            params: {
                id: 1
            }
        }
    };
    const routerMock = {
        navigate: jasmine.createSpy('navigate')
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                CrawlerDetailsComponent
            ],
            imports: [
                CoreModule,
                BrowserAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRouteMock},
                {provide: FormBuilder, useValue: formBuilder},
                {provide: CrawlerService, useClass: CrawlerServiceMock},
                {provide: UxAppShellService, useClass: UxAppShellServiceMock},
                {provide: Location, useValue: locationStub},
                {provide: Router, useClass: LocalRouteMock },
                {provide: AlertErrorService, useClass: AlertErrorServiceMock},
                {provide: PlaygroundService, useClass: PlaygroundServiceMock}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrawlerDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => { fixture.destroy(); });

    it('should create Crawler Details form', () => {
        expect(component).toBeTruthy();
        expect(component.form).not.toEqual(null);
        expect(component.currentCrawler).not.toEqual(null);
    });

    it('should open Help dialog', fakeAsync(() => {
        // TypeError: Cannot set property rows of [object HTMLTableElement] which has only a getter
        // Waiting for feedback from DIGIT-EUI-SUPPORT@ec.europa.eu
        // fixture.detectChanges();

        // component.ngOnInit();
        // fixture.detectChanges();
        //
        // let btn = fixture.debugElement.query(By.css('#open_help')) as DebugElement;
        // btn.triggerEventHandler('click', null);
        //
        // tick(); // simulates the passage of time until all pending asynchronous activities finish
        // fixture.detectChanges();
    }));

});

describe('CrawlersDetailsComponent for new Crawler', () => {
    let component: CrawlerDetailsComponent;
    let fixture: ComponentFixture<CrawlerDetailsComponent>;

    let filtersUrlFormComponent: FiltersFormComponent;
    let fixture_fc: ComponentFixture<FiltersFormComponent>;

    const formBuilder: FormBuilder = new FormBuilder();
    const locationStub = {back: jasmine.createSpy('back')};
    const activatedRouteMock = {
        snapshot: {
            params: {
                id: 1,
                get(): string {
                    return 'fake';
                },
            }
        }
    };
    const crawlerServiceMock = new CrawlerServiceMock();
    const asServiceMock = new UxAppShellServiceMock();
    const routerMock = new LocalRouteMock();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                CrawlerDetailsComponent
            ],
            imports: [
                CoreModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
            ],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRouteMock},
                {provide: FormBuilder, useValue: formBuilder},
                {provide: CrawlerService, useValue: crawlerServiceMock},
                {provide: UxAppShellService, useValue: asServiceMock},
                {provide: Location, useValue: locationStub},
                {provide: Router, useValue: routerMock },
                {provide: AlertErrorService, useClass: AlertErrorServiceMock},
                {provide: EuiDialogService},
                {provide: EuiTabComponent},

                {provide: PlaygroundService, useClass: PlaygroundServiceMock},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrawlerDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        fixture_fc = TestBed.createComponent(FiltersFormComponent);
        filtersUrlFormComponent = fixture_fc.componentInstance;
        filtersUrlFormComponent.formUrlFilterConfig = formBuilder.group({});
        fixture_fc.detectChanges();
    });

    afterAll(() => { fixture.destroy(); });

    afterEach(() => { fixture.destroy(); });

    it('should call saveCrawler when submitting a VALID new Crawler', waitForAsync(() => {
        let validCrawler: Crawler = createTestCrawler(null, 'crawler');
        let saveCrawlerSpy = spyOn(crawlerServiceMock, 'saveCrawler').and.callThrough();
        component.form.controls.name.setValue(validCrawler.name);

        component.onSave(new Event('click'));
        fixture.detectChanges();

        expect(component.form.controls.name.errors).toBeNull();
        expect(saveCrawlerSpy).toBeDefined();
        expect(saveCrawlerSpy).toHaveBeenCalled();
    }));

    it('should call saveCrawler when submitting a VALID new Crawler without filters', waitForAsync(() => {
        let validCrawler: Crawler = createTestCrawler(null, 'crawler');

        validCrawler.parserFilters = [];

        let saveCrawlerSpy = spyOn(crawlerServiceMock, 'saveCrawler').and.callThrough();
        component.form.controls.name.setValue(validCrawler.name);

        component.onSave(new Event('click'));
        fixture.detectChanges();

        expect(component.form.controls.name.errors).toBeNull();
        expect(saveCrawlerSpy).toBeDefined();
        expect(saveCrawlerSpy).toHaveBeenCalled();
    }));

    it('should call saveCrawler when submitting a VALID new Crawler  where RegexURLFilter is empty ', waitForAsync(() => {
        let validCrawler: Crawler = createTestCrawlerWithEmptyRegexURLFilter(null, 'crawler', false);
        let saveCrawlerSpy = spyOn(crawlerServiceMock, 'saveCrawler').and.callThrough();
        component.form.controls.name.setValue(validCrawler.name);

        component.onSave({});
        fixture.detectChanges();

        expect(component.form.controls.name.errors).toBeNull();
        expect(saveCrawlerSpy).toBeDefined();
        expect(saveCrawlerSpy).toHaveBeenCalled();

        expect(component.form.controls.dynamic.value).toBeFalse();
    }));

    it('should have default dynamicConfig values ', waitForAsync(() => {
        let validCrawler: Crawler = createTestCrawlerWithEmptyRegexURLFilter(null, 'crawler', true);
        expect(validCrawler.dynamicConfig.windowSize).toEqual('1920,1081');

        component.ngOnInit();
        expect(component.dynamicConfig.controls['maximized'].value).toEqual(true);
        expect(component.dynamicConfig.controls['language'].value).toEqual('en');
        expect(component.dynamicConfig.controls['windowSize'].value).toEqual('1920,1080');
        expect(component.dynamicConfig.controls['loadImages'].value).toEqual('ALLOW');
        expect(component.dynamicConfig.controls['allowCookies'].value).toEqual('BLOCK');
        expect(component.dynamicConfig.controls['allowGeolocation'].value).toEqual('BLOCK');
    }));

    it('can put Crawler in response', waitForAsync(() => {
        let validCrawler: Crawler = createTestCrawlerWithEmptyRegexURLFilter(31415, 'crawler', false);
        component.ngOnInit();
        component.processCrawlerResponse(validCrawler);
        expect(component.currentCrawler.id).toEqual(31415);
    }));

    it('can process Sources[] ', waitForAsync(() => {
        let sourcesList: Source[] = [getTestSource(1), getTestSource(2)];
        let sart: SourceArrayResponseType = new HttpResponse({status: 200, headers: new HttpHeaders(), body: sourcesList});
        let undef;

        component.ngOnInit();

        component.asyncSources = [getTestSource(11)];
        expect(component.asyncSources.length).toEqual(1);

        component.processSourcesResponse(undef, 11);
        expect(component.asyncSources.length).toEqual(1);

        component.processSourcesResponse(sart, 11);
        expect(component.asyncSourcesLoading).toBeFalse();
        expect(component.page).toEqual(11);
        expect(component.asyncSources.length).toEqual(2);
    }));

    it('should call saveCrawler when submitting a INVALID new Crawler', waitForAsync(() => {
        let invalidCrawler: Crawler = createTestCrawler(null, 'noGoodName$');
        // @ts-ignore
        let growlErrorSpy = spyOn(asServiceMock, 'growlError').and.callThrough();
        component.form.controls.name.setValue(invalidCrawler.name);

        component.onSave(new Event('click'));
        fixture.detectChanges();

        expect(component.form.controls.name.errors).not.toBeNull();
        expect(growlErrorSpy).toBeDefined();
        expect(growlErrorSpy).toHaveBeenCalled();
    }));

    it(' route to the copy path after Copy action', () => {
        component.copyCrawler(createTestCrawler(101, 'test'));
        expect(routerMock.navigate.calls.first().args[0]).toContain('./copy');
        expect(routerMock.navigate.calls.first().args[0]).toContain(101);
    });

    it('reload data on pageChange ', () => {
        let pev: PaginationEvent = {page: 1, pageSize: 3, nbPage: 10};
        component.ngOnInit();
        component.pageChange(pev);
        expect(component.asyncSourcesLoading).toBeFalse();
        expect(component.page).toEqual(0);
        expect(component.asyncSources.length).toEqual(2);
    });

    it('on Cancel should back ', () => {
        component.ngOnInit();
        component.onCancel({});
        expect(locationStub.back).not.toBeNull();
    });

    it('reload filter on filter table pageChange ', () => {
        let pev: PaginationEvent = {page: 1, pageSize: 3, nbPage: 10};
        component.ngOnInit();
        component.filterUrlPageChange(pev);
        expect(component.filterUrlPage).toEqual(0);
        expect(component.filterUrlSources.length).toEqual(2);
    });

    it('urlFilter will be extended with selected filter from table', () => {
        component.ngOnInit();
        let initLength = component.filterUrlFormDataList.length;
        component.addUrlFilter(getTestFiltersFormUrlData('extra_1'));
        expect(component.filterUrlFormDataList.length).toEqual(initLength + 1);
    });

    it('can return urlFilters is empty by default ', () => {
        component.ngOnInit();
        expect(component.form.get('urlFilters')['controls'].length).toEqual(0);
    });

    it('navigationFilter will be extended with selected filter from table', () => {
        component.ngOnInit();
        let initLength = component.filterNavigationFormDataList.length;
        component.addNavigationFilter(getTestFiltersFormUrlData('extra_1'));
        expect(component.filterNavigationFormDataList.length).toEqual(initLength + 1);
    });

    it('can return navigationFilter is empty by default ', () => {
        component.ngOnInit();
        expect(component.form.get('navigationFilters')['controls'].length).toEqual(0);
    });

    it('should set currentCrawler with default test id', () => {
        expect(component).toBeTruthy();
        expect(component.currentCrawler.id).toEqual(1);
    });

    it(' can convert Form data', () => {
        component.ngOnInit();
        let converted: any;
        converted = component.convertFromConfiguration({
            ddd: 'asdasdsada',
            configuration: {param: 1, name: 'description'},
            id: 'id_1'
        });
        expect(converted.configuration).toEqual(undefined);
        expect(converted.param).toEqual(1);
        expect(converted.name).toEqual('description');

        converted = component.convertFromConfiguration({
            noconfiguration: {param: 1, name: 'description'},
            id: 'id_1'
        });
        expect(converted.noconfiguration.name).toEqual('description');
        expect(converted.id).toEqual('id_1');

        expect(component.getUrlFiltersForm(10)).not.toBeNull();
        expect(component.getParseFiltersForm(10)).not.toBeNull();
    });

    it('urlFilter will be reduced when filter was removed from crawler ', () => {
        component.ngOnInit();
        let initLength = component.filterUrlFormDataList.length;
        // add some filter
        component.addUrlFilter(getTestFiltersFormUrlData('extra_1'));
        expect(component.filterUrlFormDataList.length).toEqual(initLength + 1);

        expect(component.isFilterUrlInList('extra_1')).toBeTrue();
        expect(component.isFilterUrlInList('extra_extra_1')).toBeFalse();

        // remove filter
        component.removeUrlFilter('extra_1');

        // try to remove non existed filter
        component.removeUrlFilter('extra_extra_1');

        expect(component.filterUrlFormDataList.length).toEqual(initLength);
    });

    it('parseFilter will be reduced when parse filter was removed from crawler ', () => {
        component.ngOnInit();
        let initLength = component.filterParseFormDataList.length;
        // add some parse filter
        component.addParseFilter(getTestFiltersFormUrlData('extra_1'));
        expect(component.filterParseFormDataList.length).toEqual(initLength + 1);

        expect(component.isFilterParseInList('extra_1')).toBeTrue();
        expect(component.isFilterParseInList('extra_extra_1')).toBeFalse();

        // remove filter
        component.removeParseFilter('extra_1');

        // try to remove non existed filter
        component.removeParseFilter('extra_extra_1');

        expect(component.filterParseFormDataList.length).toEqual(initLength);
    });

    it('navigationFilter will be reduced when parse filter was removed from crawler ', () => {
        component.ngOnInit();
        let initLength = component.filterNavigationFormDataList.length;
        // add some navigation filter
        component.addNavigationFilter(getTestFiltersFormUrlData('extra_1'));
        expect(component.filterNavigationFormDataList.length).toEqual(initLength + 1);

        expect(component.isFilterNavigationInList('extra_1')).toBeTrue();
        expect(component.isFilterNavigationInList('extra_extra_1')).toBeFalse();

        // remove filter
        component.removeNavigationFilter('extra_1');

        // try to remove non existed filter
        component.removeNavigationFilter('extra_extra_1');

        expect(component.filterNavigationFormDataList.length).toEqual(initLength);
    });

    it('should call saveCrawler when submitting a VALID new Crawler  where dynamicConfig is true ', waitForAsync(() => {
        let validCrawler: Crawler = createTestCrawlerWithEmptyRegexURLFilter(null, 'crawler', true);
        let saveCrawlerSpy = spyOn(crawlerServiceMock, 'saveCrawler').and.callThrough();

        component.ngOnInit();
        component.form.controls.name.setValue(validCrawler.name);

        component.onSave(new Event('click'));
        fixture.detectChanges();

        expect(component.form.controls.name.errors).toBeNull();
        expect(saveCrawlerSpy).toBeDefined();
        expect(saveCrawlerSpy).toHaveBeenCalled();

        expect(component.form.controls['dynamicConfig'].value.language).toEqual('en');
    }));

});

export function createTestCrawlerWithEmptyRegexURLFilter(id: number, name: string, dynamic: boolean): Crawler {
    return {
        'id': id,
        'name': name,
        'sources': [{'id': 1, 'name': 'source', 'url': 'https://source.com'},
            {'id': 2, 'name': 'source2', 'url': 'https://source2.com'}],
        'fetchInterval': 1440,
        'fetchIntervalWhenError': 44640,
        'fetchIntervalWhenFetchError': 120,
        'extractorNoText': false,
        'extractorTextIncludePattern': '- DIV[id=\'maincontent\']\r\n- DIV[itemprop=\'articleBody\']\r\n- ARTICLE',
        'extractorTextExcludeTags': '- STYLE\r\n- SCRIPT',
        'httpContentLimit': 15000000,
        'emitOutLinks': false,
        'dynamic': dynamic,
        'dynamicConfig': {
            'maximized': true,
            'language': 'en',
            'windowSize': '1920,1081',
            'loadImages': 'ALLOW',
            'allowCookies': 'BLOCK',
            'allowGeolocation': 'BLOCK'
        },
        'maxEmitOutLinksPerPage': -1,
        'urlFilters': [
            {
                'id': 'eu.europa.ec.eurostat.wihp.MyFilter.2',
                'configuration': {
                    'string1': 'q',
                    'integer2': 3,
                    'number3': 3,
                    'boolean4': false,
                    'boolean41_pizza': false,
                    'integer21_pizza': 7,
                    'number31_pizza': 1.9,
                    'array_string5': [
                        'q',
                        'q'
                    ],
                    'array_integer6': [],
                    'array_number7': [
                        3
                    ],
                    'array_boolean8': [
                        false,
                        false
                    ]
                }
            },
            {
                'id': 'eu.europa.ec.eurostat.wihp.MyFilter.5',
                'configuration': {
                    'string1': 't',
                    'integer2': 3,
                    'number3': 4.4,
                    'boolean4': true,
                    'boolean41_pizza': true,
                    'integer21_pizza': 10,
                    'number31_pizza': 1.9,
                    'array_string5': [
                        't',
                        't',
                        't'
                    ],
                    'array_integer6': [
                        6,
                        7
                    ],
                    'array_number7': [
                        7,
                        7.1
                    ],
                    'array_boolean8': [
                        true,
                        true,
                        true
                    ]
                }
            }
        ],
        'parseFilters': [
            {
                'id': 'eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicSeleniumFilter',
                'configuration': {
                    'steps': [
                        {
                            'action': 'focus',
                            'xpath': 'ahead',
                            'value': '111',
                            'highlight': false,
                            'screenshot': true
                        },
                        {
                            'action': 'select',
                            'xpath': 'all',
                            'value': '11',
                            'highlight': true,
                            'screenshot': false
                        }
                    ]
                }
            }
        ],
        'navigationFilters': [
            {
                'id': 'eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicSeleniumFilter',
                'configuration': {
                    'steps': [
                        {
                            'action': 'input',
                            'xpath': '//title',
                            'value': 'mytest',
                            'highlight': false,
                            'screenshot': true
                        }
                    ]
                }
            }
        ],
        'parserFilters': [
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.parse.filter.XPathFilter',
                'name': 'XPathFilter',
                'params': {
                    'canonical': '//*[@rel="canonical"]/@href',
                    'parse.description': [
                        '//*[@name="description"]/@content',
                        '//*[@name="Description"]/@content'
                    ],
                    'parse.title': [
                        '//TITLE',
                        '//META[@name="title"]/@content'
                    ],
                    'parse.keywords': '//META[@name="keywords"]/@content'
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.basic.BasicURLFilter',
                'name': 'BasicURLFilter',
                'params': {
                    'maxPathRepetition': 3,
                    'maxLength': 1024
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.depth.MaxDepthFilter',
                'name': 'MaxDepthFilter',
                'params': {
                    'maxDepth': -1
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.basic.BasicURLNormalizer',
                'name': 'BasicURLNormalizer',
                'params': {
                    'removeAnchorPart': false,
                    'unmangleQueryString': true,
                    'checkValidURI': true
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.host.HostURLFilter',
                'name': 'HostURLFilter',
                'params': {
                    'ignoreOutsideHost': false,
                    'ignoreOutsideDomain': true
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.regex.RegexURLFilter',
                'name': 'RegexURLFilter',
                'params': {
                    'urlFilters': ['12', '34']
                }
            },
            {
                'id': null,
                'class_name': 'eu.europa.ec.eurostat.wihp.filters.url.EsFastUrlFilter',
                'name': 'FastURLFilter',
                'params': [
                    {
                        'scope': 'GLOBAL',
                        'patterns': [
                            'DenyPathQuery \\.jpg'
                        ]
                    },
                    {
                        'scope': 'domain:stormcrawler.net',
                        'patterns': [
                            'AllowPath /digitalpebble/',
                            'DenyPath .+'
                        ]
                    },
                    {
                        'scope': 'metadata:key=value',
                        'patterns': [
                            'DenyPath .+'
                        ]
                    }
                ]
            }
        ]
    };
}
