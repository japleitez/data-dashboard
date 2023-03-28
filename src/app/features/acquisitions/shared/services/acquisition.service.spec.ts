import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { appConfig } from '../../../../../config/index';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AcquisitionService } from './acquisition.service';
import { Acquisition, CreateAcquisition } from '../models/acquisition.model';
import { Action } from '../models/action.model';

describe('Acquisition Service Test', () => {
    let service: AcquisitionService;
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let alertErrorServiceSpy: { get: jasmine.Spy };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AcquisitionService]
        });
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        alertErrorServiceSpy = jasmine.createSpyObj('alertErrorService', ['handleError']);
        service = new AcquisitionService(appConfig as any, httpClient as any, alertErrorServiceSpy as any);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it ('should AcquisitionService be create', () => {
        expect(service).toBeTruthy();
    });

    it('should get acquisition by id', waitForAsync(() => {
        // tslint:disable-next-line:max-line-length
        const acquisition: Acquisition = { id: 1, workflowId: 'wf1', crawlerName: 'cn1', status: 'PAUSED', startDate: null, lastUpdateDate: null };
        const url = appConfig.modules.acquisitions.api.base + '/' + acquisition.id;

        service.getById(acquisition.id).subscribe( (data) => {
            expect(data).toEqual(acquisition);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(acquisition);

    }));

    it ('should get acquisitions', waitForAsync(() => {
        let acquisitions: Acquisition[] = [
            { id: 1, workflowId: 'wf1', crawlerName: 'cn1', status: 'PAUSED', startDate: null, lastUpdateDate: null },
            { id: 2, workflowId: 'wf2', crawlerName: 'cn2', status: 'PAUSED', startDate: null, lastUpdateDate: null }];
        let url = appConfig.modules.acquisitions.api.base;

        service.getAcquisitions(undefined as any).subscribe((data: any) => {
            expect(data.status).toEqual(200);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(new HttpResponse({ status: 200, body: acquisitions }));
    }));

    it ('should create acquisition', waitForAsync(() => {
        // tslint:disable-next-line:max-line-length
        const acquisition: Acquisition = { id: 1, workflowId: 'wf1', crawlerName: 'cn1', status: 'PAUSED', startDate: null, lastUpdateDate: null };
        const createAcquisition: CreateAcquisition = { name: 'name', uuid: 'uuid' };
        const url = appConfig.modules.acquisitions.api.base;

        service.createAcquisition(createAcquisition).subscribe((data) => {
            expect(data).toEqual(acquisition);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('POST');
        req.flush(acquisition);
    }));

    it ('should execute acquisition', waitForAsync(() => {
        const id = 1;
        const paused = 'PAUSED';
        const action: Action = { id: id, action: paused, acquisitionId: 1, date: null, success: null };
        const url = appConfig.modules.acquisitions.api.base + '/' + id + '/action/' + paused;

        service.executeAction(id, 'PAUSED').subscribe( (data) => {
            expect(data).toEqual(action);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('POST');
        req.flush(action);
    }));

});
