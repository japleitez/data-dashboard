import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PlaygroundService } from './playground.service';
import { UrlFilter } from '../../../../shared/components/model/url-filter.model';
import { appConfig } from '../../../../../config';
import { TestBed } from '@angular/core/testing';
import {FiltersUrlTestResultData} from '../../../../shared/components/model/url-filter-test-result.model';
import {FiltersParseTestResultData} from '../../../../shared/components/model/parse-filter-test-result.model';
import {
    FiltersNavigationTestResultData
} from '../../../../shared/components/model/navigation-filter-test-result.model';

describe('PlaygroundService Test', () => {
    let service: PlaygroundService;
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let alertErrorServiceSpy: { get: jasmine.Spy };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PlaygroundService]
        });
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        alertErrorServiceSpy = jasmine.createSpyObj('alertErrorService', ['handleError']);
        service = new PlaygroundService(appConfig as any, httpClient as any, alertErrorServiceSpy as any);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it ('should PlaygroundService be create', () => {
        expect(service).toBeTruthy();
    });

    it ('should get all urlFilters', (done) => {
        // tslint:disable-next-line:max-line-length
        let urlFilters: UrlFilter[] = [{ id: '1', name: { default: '1', translationKey: '1' } }, { id: '2', name: { default: '2', translationKey: '2' } }];
        let baseUrl = appConfig.modules.playground.api.base;

        service.getUrlFilters(undefined as any).subscribe((response: HttpResponse<any>) => {
            expect(response.status).toEqual(200);
            expect(response.body.body.length).toEqual(2);
            expect(response.body.body).toEqual(urlFilters);
            done();
        });

        const req = httpMock.expectOne(baseUrl + 'url-filters');
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: urlFilters }));
    });

    it ('should get all parseFilters', (done) => {

        let parseFilters: UrlFilter[] = [{ id: '1', name: { default: '1', translationKey: '1' } }, { id: '2', name: { default: '2', translationKey: '2' } }];
        let baseUrl = appConfig.modules.playground.api.base;

        service.getParseFilters(undefined as any).subscribe((response: HttpResponse<any>) => {
            expect(response.status).toEqual(200);
            expect(response.body.body.length).toEqual(2);
            expect(response.body.body).toEqual(parseFilters);
            done();
        });
        const req = httpMock.expectOne(baseUrl + 'parse-filters');
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: parseFilters }));
    });

    it ('should get all navigationFilters', (done) => {

        let navigationFilters: UrlFilter[] = [{ id: '1', name: { default: '1', translationKey: '1' } }, { id: '2', name: { default: '2', translationKey: '2' } }];
        let baseUrl = appConfig.modules.playground.api.base;

        service.getNavigationFilters(undefined as any).subscribe((response: HttpResponse<any>) => {
            expect(response.status).toEqual(200);
            expect(response.body.body.length).toEqual(2);
            expect(response.body.body).toEqual(navigationFilters);
            done();
        });
        const req = httpMock.expectOne(baseUrl + 'navigation-filters');
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: navigationFilters }));
    });

    it ('should get urlFilter by id ', (done) => {
        let urlFilter: UrlFilter = { id: '1', name: { default: '1', translationKey: '1' } };
        let baseUrl = appConfig.modules.playground.api.base;

        service.getUrlFilter('123' as string).subscribe((response: any) => {
            expect(response).not.toBeNull();
            expect(response.status).toEqual(200);
            done();
        });
        const req = httpMock.expectOne(baseUrl + 'url-filters/123');
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: urlFilter }));
    });

    it ('should get parseFilter by id ', (done) => {
        let parseFilters: UrlFilter[] = [{ id: '1', name: { default: '1', translationKey: '1' } }, { id: '2', name: { default: '2', translationKey: '2' } }];
        let baseUrl = appConfig.modules.playground.api.base;

        service.getParseFilter('123' as string).subscribe((response: any) => {
            expect(response).not.toBeNull();
            expect(response.status).toEqual(200);
            done();
        });
        const req = httpMock.expectOne(baseUrl + 'parse-filters/123');
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: parseFilters }));
    });

    it ('should get navigationFilter by id ', (done) => {
        let navigationFilters: UrlFilter[] = [{ id: '1', name: { default: '1', translationKey: '1' } }, { id: '2', name: { default: '2', translationKey: '2' } }];
        let baseUrl = appConfig.modules.playground.api.base;

        service.getNavigationFilter('123' as string).subscribe((response: any) => {
            expect(response).not.toBeNull();
            expect(response.status).toEqual(200);
            done();
        });
        const req = httpMock.expectOne(baseUrl + 'navigation-filters/123');
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: navigationFilters }));
    });

    it ('should sent request to test parseFilter', (done) => {
        let baseUrl = appConfig.modules.playground.api.base;
        service.testParseFilter('123' as string, undefined as any).subscribe((response: FiltersParseTestResultData) => {
            expect(response).not.toBeNull();
            done();
        });
        const req = httpMock.expectOne(baseUrl + 'parse-filters/123');
        expect(req.request.method).toEqual('POST');

        const parseTestRes = new Map<string, string[]>();
        parseTestRes.set("fruit", ["apple", "banana"]);
        parseTestRes.set("vine", ["red", "white"]);

        req.flush(new HttpResponse({ status: 200, body: parseTestRes }));
    });

    it ('should sent request to test urlFilter', (done) => {
        let baseUrl = appConfig.modules.playground.api.base;
        service.testUrlFilter('123' as string, undefined as any).subscribe((response: FiltersUrlTestResultData) => {
            expect(response).not.toBeNull();
            done();
        });
        const req = httpMock.expectOne(baseUrl + 'url-filters/123');
        expect(req.request.method).toEqual('POST');
        req.flush(new HttpResponse({ status: 200, body: {} }));
    });

    it ('should sent request to test navigationFilter', (done) => {
        let baseUrl = appConfig.modules.playground.api.base;
        service.testNavigationFilter('123' as string, undefined as any).subscribe((response: FiltersNavigationTestResultData) => {
            expect(response).not.toBeNull();
            done();
        });
        const req = httpMock.expectOne(baseUrl + 'navigation-filters/123');
        expect(req.request.method).toEqual('POST');

        const parseTestRes = new Map<string, string[]>();
        parseTestRes.set("fruit", ["apple", "banana"]);
        parseTestRes.set("vine", ["red", "white"]);

        req.flush(new HttpResponse({ status: 200, body: parseTestRes }));
    });
});
