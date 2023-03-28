import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CrawlerService } from './crawler.service';
import { TestBed } from '@angular/core/testing';
import { appConfig } from '../../../../../config';
import { Crawler, createTestCrawler, createTestCrawlerList } from '../models/crawlers.model';
import { Source } from '../../../sources/shared';

describe('Crawler Service Test', function () {
    let crawlerSrv: CrawlerService;
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let alertErrorServiceSpy: { get: jasmine.Spy};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CrawlerService]
        });
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        alertErrorServiceSpy = jasmine.createSpyObj('alertErrorService', ['handleError']);
        crawlerSrv = new CrawlerService(appConfig as any, httpClient as any, alertErrorServiceSpy as any);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it ('should CrawlerService be create', () => {
        expect(crawlerSrv).toBeTruthy();
    });

    it('should get crawler by id', () => {
        const crawler: Crawler = createTestCrawler(1, 'crawler');
        const url = appConfig.modules.crawlers.api.base + '/' + crawler.id;

            crawlerSrv.getById(crawler.id).subscribe( (item) => {
            expect(item).toEqual(crawler);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(crawler);

    });

    it ('should save new Crawler', () => {
        const crawler: Crawler = createTestCrawler(null, 'crawler');
        const url = appConfig.modules.crawlers.api.base;

        crawlerSrv.saveCrawler(crawler).subscribe((item) => {
            expect(item).toEqual(crawler);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('POST');
        req.flush(crawler);
    });

    it ('should update existing Crawler', () => {
        const crawler: Crawler = createTestCrawler(1, 'crawler');
        const url = appConfig.modules.crawlers.api.base + '/' + crawler.id;

        crawlerSrv.saveCrawler(crawler).subscribe((item) => {
            expect(item).toEqual(crawler);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('PUT');
        req.flush(crawler);

    });

    it ('should get all crawlers', (done) => {
        const size = 2;
        let crawlers: Crawler[] = createTestCrawlerList(size);
        let url = appConfig.modules.crawlers.api.base;

        crawlerSrv.getCrawlers(undefined as any).subscribe((response: HttpResponse<any>) => {
            expect(response.status).toEqual(200);
            expect(response.body.body.length).toEqual(size);
            expect(response.body.body).toEqual(crawlers);
            done();
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: crawlers }));
    });

    it('should delete crawler', () => {
        const crawler: Crawler = createTestCrawler(1, 'crawler');
        const url = appConfig.modules.crawlers.api.base + '/' + crawler.id;

        crawlerSrv.deleteCrawler(crawler.id).subscribe( (item) => {
            expect(item).toEqual(crawler);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('DELETE');
        req.flush(crawler);
    });

    it('should define batch import url', () => {
        const url = crawlerSrv.getBatchImportUrl();
        expect(url).toContain('/import');
    });

    it('should get all sources for given crawler id', (done) => {
        const crawlerId = 1;
        let sourcesList: Source[] = createTestCrawler(crawlerId, 'crawler').sources;
        const sourcesListSize = sourcesList.length;
        const url = appConfig.modules.crawlers.api.base + '/' + crawlerId + '/sources';

        crawlerSrv.getSourcesForCrawler(crawlerId, undefined as any).subscribe((response: HttpResponse<any>) => {
            expect(response.status).toEqual(200);
            expect(response.body.body.length).toEqual(sourcesListSize);
            expect(response.body.body).toEqual(sourcesList);
            done();
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({status: 200, body: sourcesList}));
    });

    it('should delete source for crawler', () => {
        const crawlerId = 1;
        const crawler: Crawler = createTestCrawler(crawlerId, 'crawler');
        let sources: Source = crawler.sources[0];
        const sourceId = sources.id;
        const url = appConfig.modules.crawlers.api.base + '/' + crawler.id + '/sources/' + sourceId;

        crawlerSrv.deleteSourcesForCrawler(crawler.id, sourceId).subscribe((item) => {
            expect(item).toEqual(crawler);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('DELETE');
        req.flush(crawler);
    });

    it('should save sources for Crawler', () => {
        const crawlerId = 1;
        const crawler: Crawler = createTestCrawler(crawlerId, 'crawler');
        const sourceId = 123;
        const url = appConfig.modules.crawlers.api.base + '/' + crawler.id + '/sources/' + sourceId;

        crawlerSrv.saveSourcesForCrawler(crawler.id, sourceId).subscribe((response: HttpResponse<any>) => {
            expect(response.status).toEqual(200);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('POST');
        req.flush(new HttpResponse({status: 200}));
    });

});
