import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SourceService } from './source.service';
import { Source } from '../models/source.model';
import { appConfig } from '../../../../../config/index';
import { TestBed } from '@angular/core/testing';

describe('Source Service Test', () => {
    let service: SourceService;
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let alertErrorServiceSpy: { get: jasmine.Spy };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SourceService]
        });
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        alertErrorServiceSpy = jasmine.createSpyObj('alertErrorService', ['handleError']);
        service = new SourceService(appConfig as any, httpClient as any, alertErrorServiceSpy as any);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it ('should SourceService be create', () => {
        expect(service).toBeTruthy();
    });

    it('should get source by id', () => {
        const source: Source = { id: 1, name: 'source1', url: 'https://source1' };
        const url = appConfig.modules.sources.api.base + '/' + source.id;

        service.getById(source.id).subscribe( (src) => {
            expect(src).toEqual(source);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(source);

    });

    it ('should save new Source', () => {
        const source: Source = { id: null, name: 'source1', url: 'https://source1' };
        const url = appConfig.modules.sources.api.base;

        service.saveSource(source).subscribe((src) => {
           expect(src).toEqual(source);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('POST');
        req.flush(source);
    });

    it ('should update existing Source', () => {
        const source: Source = { id: 1, name: 'source1', url: 'https://source1' };
        const url = appConfig.modules.sources.api.base + '/' + source.id;

        service.saveSource(source).subscribe((src) => {
            expect(src).toEqual(source);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('PUT');
        req.flush(source);

    });

    it ('should get all sources', (done) => {
        // tslint:disable-next-line:max-line-length
        let sources: Source[] = [{ id: 1, name: 'source1', url: 'https://source1' }, { id: 2, name: 'source2', url: 'https://source2' }];
        let url = appConfig.modules.sources.api.base;

        service.getSources(undefined as any).subscribe((response: HttpResponse<any>) => {
            expect(response.status).toEqual(200);
            expect(response.body.body.length).toEqual(2);
            expect(response.body.body).toEqual(sources);
            done();
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: sources }));
    });

    it('should delete source', () => {
        const source: Source = { id: 1, name: 'source1', url: 'https://source1' };
        const url = appConfig.modules.sources.api.base + '/' + source.id;

        service.deleteSource(source.id).subscribe( (src) => {
            expect(src).toEqual(source);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('DELETE');
        req.flush(source);
    });

    it('should define batch import url', () => {
        const url = service.getBatchImportUrl();
        expect(url).toContain('/batch/import');
    });

});
