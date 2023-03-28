import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CONFIG_TOKEN } from '@eui/core';
import { UrlFilter } from '../../../../shared/components/model/url-filter.model';
import { AlertErrorService } from '../../../../shared/alerts/alert-error.service';
import { createRequestOption } from '../../../../shared/request/request-util';
import { FiltersUrlTestResultData } from '../../../../shared/components/model/url-filter-test-result.model';
import { FiltersParseTestResultData } from '../../../../shared/components/model/parse-filter-test-result.model';
import { FiltersFormUrlData } from '../../../../shared/components/model/url-filter-form.model';
import {
    FiltersNavigationTestResultData
} from '../../../../shared/components/model/navigation-filter-test-result.model';

export type UrlFilterArrayResponseType = HttpResponse<UrlFilter[]>;

@Injectable()
export class PlaygroundService {

    private url;

    private URL_FILTER_API: string = 'url-filters';
    private PARSE_FILTER_API: string = 'parse-filters';
    private NAVIGATION_FILTER_API: string = 'navigation-filters';

    constructor(
        @Inject(CONFIG_TOKEN) protected config: any,
        private http: HttpClient,
        private alertErrorService: AlertErrorService
    ) {
        this.url = `${config.modules.playground.api.base}`;
    }

    getUrlFilters(req: any): Observable<UrlFilterArrayResponseType> {
        return this.getCustomFiltersFilters(req, this.URL_FILTER_API);
    }

    getParseFilters(req: any): Observable<UrlFilterArrayResponseType> {
        return this.getCustomFiltersFilters(req, this.PARSE_FILTER_API);
    }

    getNavigationFilters(req: any): Observable<UrlFilterArrayResponseType> {
        return this.getCustomFiltersFilters(req, this.NAVIGATION_FILTER_API);
    }

    getUrlFilter(filterId: string): Observable<FiltersFormUrlData> {
        return this.getCustomFilter(filterId, this.URL_FILTER_API);
    }

    getParseFilter(filterId: string): Observable<FiltersFormUrlData> {
        return this.getCustomFilter(filterId, this.PARSE_FILTER_API);
    }

    getNavigationFilter(filterId: string): Observable<FiltersFormUrlData> {
        return this.getCustomFilter(filterId, this.NAVIGATION_FILTER_API);
    }

    testUrlFilter(filterId: string, filterValues: any): Observable<FiltersUrlTestResultData> {
        return this.http.post<FiltersUrlTestResultData>(this.url + this.URL_FILTER_API + '/' + filterId, filterValues)
            .pipe(catchError(this.alertErrorService.handleError));
    }

    testParseFilter(filterId: string, filterValues: any): Observable<FiltersParseTestResultData> {
        return this.http.post<FiltersParseTestResultData>(this.url + this.PARSE_FILTER_API + '/' + filterId, filterValues)
            .pipe(catchError(this.alertErrorService.handleError));
    }

    testNavigationFilter(filterId: string, filterValues: any): Observable<FiltersNavigationTestResultData> {
        return this.http.post<FiltersNavigationTestResultData>(this.url + this.NAVIGATION_FILTER_API + '/' + filterId, filterValues)
            .pipe(catchError(this.alertErrorService.handleError));
    }

    getCustomFiltersFilters(req: any, filterApi: string): Observable<UrlFilterArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<UrlFilter[]>(this.url + filterApi, { params: options, observe: 'response' })
            .pipe(catchError(this.alertErrorService.handleError));
    }

    getCustomFilter(filterId: string, filterApi: string): Observable<FiltersFormUrlData> {
        return this.http.get<FiltersFormUrlData>(this.url + filterApi + '/' + filterId)
            .pipe(catchError(this.alertErrorService.handleError));
    }
}
