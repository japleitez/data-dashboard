import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { markFormGroupTouched, UxAppShellService } from '@eui/core';
import { PaginationEvent } from '@eui/components/eui-table';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';
import { Filter } from '../../shared/models/filters.model';
import { Crawler, CrawlerService } from '../../shared';
import { SourceArrayResponseType } from '../../shared/services/crawler.service';
import { FastURLFilterDefault, RegexURLFilterDefault, XPathFilterDefault } from '../../shared/models/defaults.model';
import { nameRegexCrawlerNameValidator } from '../../../../shared/validators/name-regex.directive';
import { paramJsonValidator } from '../../../../shared/validators/param-json.directive';
import { languageValidator } from '../../../../shared/validators/language.directive';
import { windowSizeValidator } from '../../../../shared/validators/window-size.directive';
import { CrawlersHelpComponent } from '../help/crawlers.help.component';
import { forkJoin, Observable } from 'rxjs';
import { RequestUtil, sortById } from '../../../../shared/request/request-util';
import { FiltersFormUrlData } from '../../../../shared/components/model/url-filter-form.model';
import { PlaygroundService, UrlFilterArrayResponseType } from '../../../playground/shared/service/playground.service';
import { HttpResponse } from '@angular/common/http';

@Component({
    templateUrl: './crawler.details.component.html',
})
export class CrawlerDetailsComponent implements OnInit {

    get parserFilters() {
        return this.form.controls['parserFilters'] as FormArray;
    }

    get dynamicConfig() {
        return this.form.controls['dynamicConfig'] as FormGroup;
    }

    private get parseFiltersFormArray() {
        return this.getFormArray('parseFilters');
    }

    private get navigationFiltersFormArray() {
        return this.getFormArray('navigationFilters');
    }

    private get urlFiltersFormArray() {
        return this.getFormArray('urlFilters');
    }

    form: FormGroup;
    currentCrawler: Crawler;
    public isParserFiltersDisabled = true;

    public asyncSources: any[] = [];
    public asyncSourcesLength: number;
    public asyncSourcesLoading = false;
    public page = 0;
    public pageSize = 10;
    public pageSizeOptions = [5, 10, 25, 100];

    public filterUrlSources: any[] = [];
    public filterUrlSourcesLength: number;
    public filterUrlSourcesLoading = false;
    public filterUrlPage = 0;
    public filterUrlPageSize = 10;
    public filterUrlPageSizeOptions = [5, 10, 25, 100];

    public filterParseSources: any[] = [];
    public filterParseSourcesLength: number;
    public filterParseSourcesLoading = false;
    public filterParsePage = 0;
    public filterParsePageSize = 10;
    public filterParsePageSizeOptions = [5, 10, 25, 100];

    public filterNavigationSources: any[] = [];
    public filterNavigationSourcesLength: number;
    public filterNavigationSourcesLoading = false;
    public filterNavigationPage = 0;
    public filterNavigationPageSize = 10;
    public filterNavigationPageSizeOptions = [5, 10, 25, 100];

    private filtersPatches: any[] = [];

    public filterUrlFormDataList: FiltersFormUrlData[] = [];
    private isValidForm: boolean = false;
    public loadedUrlFiltersFormValues: any = [];

    public filterParseFormDataList: FiltersFormUrlData[] = [];
    public loadedParseFiltersFormValues: any = [];

    public filterNavigationFormDataList: FiltersFormUrlData[] = [];
    public loadedNavigationFiltersFormValues: any = [];

    constructor(
        private euiDialogService: EuiDialogService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private crawlerService: CrawlerService,
        private asService: UxAppShellService,
        private location: Location,
        private playgroundService: PlaygroundService,
    ) {
        this.filtersPatches.push(this.filterPatch, this.jsonFilterPatch, this.lineFilterPatch);
    }

    ngOnInit() {
        this.asyncSourcesLoading = true;
        this.filterUrlSourcesLoading = true;
        this.filterParseSourcesLoading = true;
        this.filterNavigationSourcesLoading = true;

        this._buildForm();
        this._loadCrawlerSourcesFilters(this.page, { page: this.page, size: this.pageSize, sort: sortById() },
            this.filterUrlPage, { filterUrlPage: this.filterUrlPage, size: this.filterUrlPageSize, sort: sortById() },
            this.filterParsePage, { filterParsePage: this.filterParsePage, size: this.filterParsePageSize, sort: sortById() },
            this.filterNavigationPage, { filterNavigationPage: this.filterNavigationPage, size: this.filterNavigationPageSize, sort: sortById() }
        );
    }

    public hasLegacyParserFilters(): boolean {
        if (this.currentCrawler && this.currentCrawler.id) {
            return this.currentCrawler.parserFilters && this.currentCrawler.parserFilters.length > 0;
        } else {
            return false;
        }
    }

    public pageChange(e: PaginationEvent) {
        this._getSources(this.page, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    copyCrawler(crawler: Crawler) {
        this.router.navigate(['./copy', crawler.id], { relativeTo: this.route.parent });
    }

    configureSources() {
        this.router.navigate(['./details/', this.currentCrawler.id, 'sources'], { relativeTo: this.route.parent });
    }

    openHelp() {
        this.euiDialogService.openDialog(new EuiDialogConfig({
            title: 'Crawlers Configuration',
            width: '65vw',
            bodyComponent: {
                component: CrawlersHelpComponent,
            },
            dismissLabel: 'CLOSE',
            hasAcceptButton: false,
            close: () => { },
        }));
    }

    onSave(event: any): void {
        markFormGroupTouched(this.form.controls);
        if (!this.form.valid) {
            this.asService.growlError('The form is invalid, please fix the errors');
        } else {
            this.toJSON(this.form.value.parserFilters);
            this.toJsonUrlFilters(this.form.value.urlFilters);
            this.toJsonUrlFilters(this.form.value.parseFilters);
            this.toJsonUrlFilters(this.form.value.navigationFilters);
            this.crawlerService.saveCrawler(this.form.value).subscribe(
                (crawler: Crawler) => {
                    this.asService.growlSuccess('Crawler successfully saved');
                    this.location.back();
                }, error => {
                    this.handleError(error);
                });
        }
    }

    onCancel(event: any): void {
        this.location.back();
    }

    isDynamicEnabled() {
        return this.form.controls['dynamic'].value;
    }

    isExistingCrawler() {
        return (this.currentCrawler && this.currentCrawler.id);
    }

    filterName(filter: FormGroup) {
        return filter.get('name').value;
    }

    filterParams(filter: FormGroup) {
        return filter.get('params');
    }

    processUrlFilterResponse(response: UrlFilterArrayResponseType, page: number) {
        if (response) {
            this.filterUrlSourcesLength = RequestUtil.getTotalLengthHeader(response);
            this.filterUrlSourcesLoading = false;
            this.filterUrlPage = page;
            this.filterUrlSources = response.body;
        }
    }

    processParseFilterResponse(response: UrlFilterArrayResponseType, page: number) {
        if (response) {
            this.filterParseSourcesLength = RequestUtil.getTotalLengthHeader(response);
            this.filterParseSourcesLoading = false;
            this.filterParsePage = page;
            this.filterParseSources = response.body;
        }
    }

    processNavigationFilterResponse(response: HttpResponse<any>, page: number) {
        if (response) {
            this.filterNavigationSourcesLength = RequestUtil.getTotalLengthHeader(response);
            this.filterNavigationSourcesLoading = false;
            this.filterNavigationPage = page;
            this.filterNavigationSources = response.body;
        }
    }

    getCrawlerSourcesFilters(
        crawlerID: number, reqSource: any, reqUrlFilter: any,
        reqParseFilter: any, reqNavigationFilter: any): Observable<any> {
        const obs1 = this.crawlerService.getById(crawlerID);
        const obs2 = this.crawlerService.getSourcesForCrawler(crawlerID, reqSource);
        const obs3 = this.playgroundService.getUrlFilters(reqUrlFilter);
        const obs4 = this.playgroundService.getParseFilters(reqParseFilter);
        const obs5 = this.playgroundService.getNavigationFilters(reqNavigationFilter);
        return forkJoin([obs1, obs2, obs3, obs4, obs5]);
    }

    processSourcesResponse(response: SourceArrayResponseType, page: number) {
        if (response) {
            this.asyncSourcesLength = RequestUtil.getTotalLengthHeader(response);
            this.asyncSourcesLoading = false;
            this.page = page;
            this.asyncSources = response.body;
        }
    }

    processCrawlerResponse(crawler: Crawler) {
        if (crawler) {
            this.currentCrawler = crawler;
            this.form.patchValue({
                id: crawler.id,
                name: crawler.name,
                fetchInterval: crawler.fetchInterval,
                fetchIntervalWhenError: crawler.fetchIntervalWhenError,
                fetchIntervalWhenFetchError: crawler.fetchIntervalWhenFetchError,
                extractorNoText: crawler.extractorNoText,
                extractorTextIncludePattern: crawler.extractorTextIncludePattern,
                extractorTextExcludeTags: crawler.extractorTextExcludeTags,
                httpContentLimit: crawler.httpContentLimit,
                dynamic: crawler.dynamic,
                emitOutLinks: crawler.emitOutLinks,
                maxEmitOutLinksPerPage: crawler.maxEmitOutLinksPerPage,
            });
            if (crawler.dynamicConfig) {
                this.form.controls['dynamicConfig'].patchValue({
                    language: crawler.dynamicConfig.language,
                    maximized: crawler.dynamicConfig.maximized,
                    windowSize: crawler.dynamicConfig.windowSize,
                    loadImages: crawler.dynamicConfig.loadImages,
                    allowCookies: crawler.dynamicConfig.allowCookies,
                    allowGeolocation: crawler.dynamicConfig.allowGeolocation
                });
            }
            if (this.hasLegacyParserFilters()) {
                const parserFilters: FormArray = this.form.controls['parserFilters'] as FormArray;
                parserFilters.controls.forEach((group: FormGroup) =>
                    this.filtersPatches.forEach(filtersPatch => filtersPatch(group, crawler.parserFilters))
                );
            } else {
                this.form.controls['parserFilters'] = this.fb.array([]);
            }

            if (crawler.urlFilters) {
                // prepare data for the filters
                crawler.urlFilters.forEach(urlFilterFormValue => {
                    this.loadedUrlFiltersFormValues.push(this.convertFromConfiguration(urlFilterFormValue));
                });
                // request urlFilters schemas by filter ID
                crawler.urlFilters.forEach((filterUrlItem) => {
                    this.addUrlFilter(filterUrlItem);
                });
            }

            if (crawler.parseFilters) {
                // prepare data for the filters
                crawler.parseFilters.forEach(parseFilterFormValue => {
                    this.loadedParseFiltersFormValues.push(this.convertFromConfiguration(parseFilterFormValue));
                });
                // request urlFilters schemas by filter ID
                crawler.parseFilters.forEach((filterParseItem) => {
                    this.addParseFilter(filterParseItem);
                });
            }

            if (crawler.navigationFilters) {
                // prepare data for the filters
                crawler.navigationFilters.forEach(value => {
                    this.loadedNavigationFiltersFormValues.push(this.convertFromConfiguration(value));
                });
                // request filters schemas by filter ID
                crawler.navigationFilters.forEach((item) => {
                    this.addNavigationFilter(item);
                });
            }
        }
    }

    public filterUrlPageChange(e: PaginationEvent) {
        this._getFilterUrlSources(this.filterUrlPage, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    public filterParsePageChange(e: PaginationEvent) {
        this._getFilterParseSources(this.filterParsePage, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    public filterNavigationPageChange(e: PaginationEvent) {
        this._getFilterNavigationSources(this.filterParsePage, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    addUrlFilter(filterUrlData: FiltersFormUrlData) {
        this.playgroundService.getUrlFilter(filterUrlData.id)
            .subscribe((filtersFormUrlData_: FiltersFormUrlData) => {
                this.filterUrlFormDataList.push(filtersFormUrlData_);
            });
    }

    addParseFilter(filterUrlData: FiltersFormUrlData) {
        this.playgroundService.getParseFilter(filterUrlData.id)
            .subscribe((filtersFormUrlData_: FiltersFormUrlData) => {
                this.filterParseFormDataList.push(filtersFormUrlData_);
            });
    }

    addNavigationFilter(filterUrlData: FiltersFormUrlData) {
        this.playgroundService.getNavigationFilter(filterUrlData.id)
            .subscribe((filtersFormUrlData_: FiltersFormUrlData) => {
                this.filterNavigationFormDataList.push(filtersFormUrlData_);
            });
    }

    removeUrlFilter(filterID: string) {
        this.removeFilter(filterID, this.filterUrlFormDataList, this.urlFiltersFormArray);
    }

    removeParseFilter(filterID: string) {
        this.removeFilter(filterID, this.filterParseFormDataList, this.parseFiltersFormArray);
    }

    removeNavigationFilter(filterID: string) {
        this.removeFilter(filterID, this.filterNavigationFormDataList, this.navigationFiltersFormArray);
    }

    isFilterUrlInList(filterID: string): boolean {
        return this.filterUrlFormDataList.some(f => f.id === filterID);
    }

    isFilterParseInList(filterID: string): boolean {
        return this.filterParseFormDataList.some(f => f.id === filterID);
    }

    isFilterNavigationInList(filterID: string): boolean {
        return this.filterNavigationFormDataList.some(f => f.id === filterID);
    }

    isCrawlerFormValid(): boolean {
        this.isValidForm = this.form.valid;
        return this.isValidForm;
    }

    public getUrlFiltersForm(index: number) {
        let arrayLength = this.urlFiltersFormArray.length;
        if ( (arrayLength - 1) < index) {
            let filterForm: FormGroup = this.fb.group({});
            this.urlFiltersFormArray.push(filterForm);
            return filterForm;
        }
        return this.urlFiltersFormArray['controls'][index];
    }

    public getParseFiltersForm(index: number) {
        let arrayLength = this.parseFiltersFormArray.length;
        if ( (arrayLength - 1) < index) {
            let filterForm: FormGroup = this.fb.group({});
            this.parseFiltersFormArray.push(filterForm);
            return filterForm;
        }
        return this.parseFiltersFormArray['controls'][index];
    }

    public getNavigationFiltersForm(index: number) {
        const arrayLength = this.navigationFiltersFormArray.length;
        if ( (arrayLength - 1) < index) {
            const filterForm: FormGroup = this.fb.group({});
            this.navigationFiltersFormArray.push(filterForm);
            return filterForm;
        }
        return this.navigationFiltersFormArray.controls[index];
    }

    public convertFromConfiguration(urlFilterFormValue: any) {
        if (urlFilterFormValue.configuration) {
            urlFilterFormValue = urlFilterFormValue.configuration;
            delete urlFilterFormValue['configuration'];
        }
        return urlFilterFormValue;
    }

    private removeFilter(filterID: string, formDataList: FiltersFormUrlData[], formArray: FormArray) {
        const filterIndex = formDataList.findIndex(i => i.id === filterID);
        formArray.removeAt(filterIndex);
        formDataList.splice(filterIndex, 1);
    }

    private getFormArray(arrayId: string) {
        return this.form.get(arrayId) as FormArray;
    }

    private _buildForm() {
        this.form = this.fb.group({
            'id': [null],
            'name': [null, Validators.compose([Validators.required, nameRegexCrawlerNameValidator(), Validators.maxLength(100)])],
            'fetchInterval': [1440, Validators.compose([Validators.required, Validators.min(-1), Validators.max(525600)])],
            'fetchIntervalWhenError': [44640, Validators.compose([Validators.required, Validators.min(-1), Validators.max(525600)])],
            'fetchIntervalWhenFetchError': [120, Validators.compose([Validators.required, Validators.min(-1), Validators.max(525600)])],
            'extractorNoText': [false, Validators.required],
            'extractorTextIncludePattern': ['- DIV[id="maincontent"]\r\n- DIV[itemprop="articleBody"]\r\n- ARTICLE'],
            'extractorTextExcludeTags': ['- STYLE\r\n- SCRIPT'],
            'httpContentLimit': [15000000, Validators.compose([Validators.required, Validators.min(-1), Validators.max(2147483647)])],
            'emitOutLinks': [false, Validators.required],
            'dynamic': [false, Validators.required],
            'dynamicConfig': this.fb.group({
                'language': ['en', Validators.compose([Validators.required, languageValidator()])],
                'maximized': [true, Validators.required],
                'windowSize': ['1920,1080', Validators.compose([Validators.required, windowSizeValidator()])],
                'loadImages': ['ALLOW', Validators.required],
                'allowCookies': ['BLOCK', Validators.required],
                'allowGeolocation': ['BLOCK', Validators.required]
            }),
            'maxEmitOutLinksPerPage': ['-1', Validators.compose([Validators.required, Validators.min(-1), Validators.max(2147483647)])],
            'urlFilters': this.fb.array([]),
            'parseFilters': this.fb.array([]),
            'navigationFilters': this.fb.array([]),
            'parserFilters': this.fb.array([this.getXPathFilter(),
                this.getBasicUrlFilter(),
                this.getMaxDepthFilter(),
                this.getBasicURLNormalizer(),
                this.getHostURLFilter(),
                this.getRegexURLFilter(),
                this.getFastURLFilter()])
        });
        this.currentCrawler = this.form.value;
    }

    private toJSON(parserFilters: Filter[]) {
        if (this.hasLegacyParserFilters()) {
            const filterNames: String[] = ['FastURLFilter', 'XPathFilter'];
            filterNames.forEach(name => {
                let filter = parserFilters.find(f => name === f.name);
                if ('' !== filter.params) {
                    filter.params = JSON.parse(filter.params);
                }
            });

            let regexURLFilter = parserFilters.find(f => 'RegexURLFilter' === f.name);
            if ('' !== regexURLFilter.params.regexFilter) {
                regexURLFilter.params = {
                    urlFilters: regexURLFilter.params.regexFilter.split(/\r?\n/)
                };
            }
        }
    }

    private toJsonUrlFilters(urlFilterForms: any[]) {
        let filterId: string = '';
        const numberOfUrlFilters = urlFilterForms.length;

        urlFilterForms.forEach((urlFilterForm) => {
            filterId = urlFilterForm.id;
            delete urlFilterForm['id'];
            urlFilterForms.push({
                id: filterId,
                configuration: urlFilterForm
            });
        });
        urlFilterForms.splice(0, numberOfUrlFilters);
    }

    private getXPathFilter(id = null, params = XPathFilterDefault) {
        return this.fb.group({
            'id': [id],
            'className': ['com.digitalpebble.stormcrawler.parse.filter.XPathFilter'],
            'name': ['XPathFilter'],
            'params': [params, paramJsonValidator()]
        });
    }

    private getBasicUrlFilter(id = null, maxPathRepetition = 3, maxLength = 1024) {
        return this.fb.group({
            'id': [id],
            'className': ['com.digitalpebble.stormcrawler.filtering.basic.BasicURLFilter'],
            'name': ['BasicURLFilter'],
            'params': this.fb.group({
                'maxPathRepetition': [maxPathRepetition, Validators.compose([Validators.required, Validators.min(1), Validators.max(10)])],
                'maxLength': [maxLength, Validators.compose([Validators.required, Validators.min(0), Validators.max(1024)])]
            })
        });
    }

    private getMaxDepthFilter(id = null, maxDepth = -1) {
        return this.fb.group({
            'id': [id],
            'className': ['com.digitalpebble.stormcrawler.filtering.depth.MaxDepthFilter'],
            'name': ['MaxDepthFilter'],
            'params': this.fb.group({
                'maxDepth': [maxDepth, Validators.compose([Validators.required, Validators.min(-1), Validators.max(2147483647)])]
            })
        });
    }

    private getBasicURLNormalizer(id = null, removeAnchorPart = false, unmangleQueryString = true, checkValidURI = true) {
        return this.fb.group({
            'id': [id],
            'className': ['com.digitalpebble.stormcrawler.filtering.basic.BasicURLNormalizer'],
            'name': ['BasicURLNormalizer'],
            'params': this.fb.group({
                'removeAnchorPart': [removeAnchorPart],
                'unmangleQueryString': [unmangleQueryString],
                'checkValidURI': [checkValidURI]
            })
        });
    }

    private getHostURLFilter(id = null, ignoreOutsideHost = false, ignoreOutsideDomain = true) {
        return this.fb.group({
            'id': [id],
            'className': ['com.digitalpebble.stormcrawler.filtering.host.HostURLFilter'],
            'name': ['HostURLFilter'],
            'params': this.fb.group({
                'ignoreOutsideHost': [ignoreOutsideHost],
                'ignoreOutsideDomain': [ignoreOutsideDomain]
            })
        });
    }

    private getRegexURLFilter(id = null, regexFilter = RegexURLFilterDefault) {
        return this.fb.group({
            'id': [id],
            'className': ['com.digitalpebble.stormcrawler.filtering.regex.RegexURLFilter'],
            'name': ['RegexURLFilter'],
            'params': this.fb.group({
                'regexFilter': [regexFilter]
            })
        });
    }

    private getFastURLFilter(id = null, params = FastURLFilterDefault) {
        return this.fb.group({
            'id': [id],
            'className': ['eu.europa.ec.eurostat.wihp.filters.url.EsFastUrlFilter'],
            'name': ['FastURLFilter'],
            'params': [params, paramJsonValidator()]
        });
    }

    private _loadCrawlerSourcesFilters(pageSource: number, reqSource: any,
                                       pageUrlFilter: number, reqUrlFilter: any,
                                       pageParseFilter: number, reqParseFilter: any,
                                       pageNavigationFilter: number, reqNavigationFilter: any
    ) {
        const crawlerID = this.route.snapshot.params['id'];
        if (crawlerID) {
            this.getCrawlerSourcesFilters(crawlerID, reqSource, reqUrlFilter, reqParseFilter, reqNavigationFilter)
                .subscribe({
                    next: ([crawler, sources, urlFilters, parseFilters, navigationFilters]) => {
                        this.processCrawlerResponse(crawler);
                        this.processSourcesResponse(sources, pageSource);
                        this.processUrlFilterResponse(urlFilters, pageUrlFilter);
                        this.processParseFilterResponse(parseFilters, pageParseFilter);
                        this.processNavigationFilterResponse(navigationFilters, pageNavigationFilter);
                    },
                    error: (error) => {
                        this.handleError(error);
                    }
                });
        } else {
            this.filterUrlPageChange({ page: 0, pageSize: 10, nbPage: 10 });
            this.filterParsePageChange({ page: 0, pageSize: 10, nbPage: 10 });
            this.filterNavigationPageChange({ page: 0, pageSize: 10, nbPage: 10 });
        }
    }

    private _getSources(page: number, req: any) {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.crawlerService.getSourcesForCrawler(id, req)
                .subscribe((response: SourceArrayResponseType) => {
                    this.processSourcesResponse(response, page);
                }, error => {
                    this.handleError(error);
                });
        }
    }

    private filterPatch(group: FormGroup, parserFilters: Filter[]) {
        const filterNames: String[] = ['HostURLFilter',
            'BasicURLNormalizer', 'MaxDepthFilter', 'BasicURLFilter'];
        const filterName = group.controls['name'].value;
        if (filterNames.includes(filterName) && parserFilters && parserFilters.length > 0) {
            group.patchValue(parserFilters.find(f => filterName === f.name));
        }
    }

    private jsonFilterPatch(group: FormGroup, parserFilters: Filter[]) {
        const filterNames: String[] = ['FastURLFilter', 'XPathFilter'];
        const filterName = group.controls['name'].value;
        if (filterNames.includes(filterName) && parserFilters && parserFilters.length > 0) {
            let filter = parserFilters.find(f => filterName === f.name);
            if (filter) {
                filter.params = JSON.stringify(filter.params, null, 2);
                group.patchValue(filter);
            }
        }
    }

    private lineFilterPatch(group: FormGroup, parserFilters: Filter[]) {
        const filterNames: String[] = ['RegexURLFilter'];
        const filterName = group.controls['name'].value;
        if (filterNames.includes(filterName) && parserFilters && parserFilters.length > 0) {
            let regexUrlFilter = parserFilters.find(f => filterName === f.name);
            regexUrlFilter.params = {
                regexFilter: regexUrlFilter.params.urlFilters?.join('\r\n')
            };
            group.patchValue(regexUrlFilter);
        }
    }

    private handleError(error: any): void {
        if (error && error.summary) {
            this.asService.growl({
                    severity: error.severity,
                    summary: error.summary,
                    detail: error.detail
                },
                error.isGrowlSticky,
                error.isGrowlMultiple,
                error.growlLife,
                error.position,
            );
        } else {
            this.asService.growl({ severity: 'danger', summary: 'ERROR', detail: '' + <any>error });
        }
    }

    private _getFilterUrlSources(pageFilter: number, req: any) {
        this.playgroundService.getUrlFilters(req)
            .subscribe({
                next: (response) => this.processUrlFilterResponse(response, pageFilter),
                error: (error) => this.handleError(error)
            });
    }

    private _getFilterParseSources(pageFilter: number, req: any) {
        this.playgroundService.getParseFilters(req)
            .subscribe({
                next: (response) => this.processParseFilterResponse(response, pageFilter),
                error: (error) => this.handleError(error)
            });
    }

    private _getFilterNavigationSources(pageFilter: number, req: any) {
        this.playgroundService.getNavigationFilters(req)
            .subscribe({
                next: (response) => this.processNavigationFilterResponse(response, pageFilter),
                error: (error) => this.handleError(error)
            });
    }

}
