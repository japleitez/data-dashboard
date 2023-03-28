import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AcqListComponent } from './acq.list.component';
import { Acquisition, AcquisitionService } from '../../shared';
import { createTestsAcquisitionList } from '../../shared/test_data/acquisition.testdata';
import { PaginationEvent } from '@eui/components/eui-table';
import { EntityArrayResponseType } from '../../shared/services/acquisition.service';
import { Action } from '../../shared/models/action.model';
import { ActivatedRoute, Router } from '@angular/router';

let passedActionNumber: number = -10;
let passedActionName: string = '';
let passedDetailMessage: string = '';

class UxAppShellServiceMock {
    state$ = of(null);

    growlSuccess(msg: string): void {
        expect(msg).not.toBeNull();
    }

    growl(msg: any): void {
        passedDetailMessage = msg.detail;
    }
}

class AcquisitionServiceMock {
    getAcquisitions({}): Observable<EntityArrayResponseType> {
        let acquisitions: Acquisition[] = createTestsAcquisitionList(2);
        return of(new HttpResponse({status: 200, body: acquisitions}));
    }

    executeAction(id: number, action: string): Observable<Action> {
        passedActionName = action;
        passedActionNumber = id;
        let act =  getTestAction();
        if ( id === -100 ) {
            act.success = undefined;
        }
        return of(act);
    }
}

describe('Acquisition List Component Test', () => {
    let component: AcqListComponent;
    let fixture: ComponentFixture<AcqListComponent>;
    let routerSpy;
    let acquisitionServiceMock = new AcquisitionServiceMock();
    let uxAppShellService: UxAppShellService;
    beforeEach(() => {
        // tslint:disable-next-line:max-line-length
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [
                AcqListComponent
            ],
            providers: [
                {provide: AcquisitionService, useValue: acquisitionServiceMock},
                {provide: Router, useValue: routerSpy},
                {provide: UxAppShellService, useClass: UxAppShellServiceMock},
                {
                    provide: ActivatedRoute, useValue: {
                        snapshot: {
                            paramMap: {
                                get(): string {
                                    return 'fake';
                                },
                            },
                        },
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        uxAppShellService = TestBed.inject(UxAppShellService);

        fixture = TestBed.createComponent(AcqListComponent);

        component = fixture.componentInstance;

        passedActionNumber = -10;
        passedActionName = '';
        passedDetailMessage = '';
    });

    it('Crawler List component shall be created', () => {
        expect(component).toBeTruthy();
    });

    it('shall navigate to Crawler Details page when onCreateSource is clicked', () => {
        component.ngOnInit();
        component.onCreateAcquisition({});
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./details');
    });

    it(' route to the detail path after Create action', () => {
        component.onCreateAcquisition({});
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./details');
    });

    it(' can stop Acquisition ', () => {
        expect(component.canStop(createTestAcquisitionWithStatus('PROVISIONING'))).toBeTrue();
        expect(component.canStop(createTestAcquisitionWithStatus('QUEUED'))).toBeTrue();
        expect(component.canStop(createTestAcquisitionWithStatus('RUNNING'))).toBeTrue();
        expect(component.canStop(createTestAcquisitionWithStatus('PAUSED'))).toBeTrue();
    });

    it(' can  not stop Acquisition ', () => {
        component.ngOnInit();
        expect(component.canStop(createTestAcquisitionWithStatus('STOPPED'))).toBeFalse();
        expect(component.canStop(createTestAcquisitionWithStatus('SUCCESS'))).toBeFalse();
        expect(component.canStop(createTestAcquisitionWithStatus('ERROR'))).toBeFalse();
    });

    it(' can pause Acquisition ', () => {
        expect(component.canPause(createTestAcquisitionWithStatus('RUNNING'))).toBeTrue();
    });

    it(' can not pause Acquisition ', () => {
        expect(component.canPause(createTestAcquisitionWithStatus('PROVISIONING'))).toBeFalse();
        expect(component.canPause(createTestAcquisitionWithStatus('QUEUED'))).toBeFalse();
        expect(component.canPause(createTestAcquisitionWithStatus('PAUSED'))).toBeFalse();
        expect(component.canPause(createTestAcquisitionWithStatus('ERROR'))).toBeFalse();
        expect(component.canPause(createTestAcquisitionWithStatus('SUCCESS'))).toBeFalse();
    });

    it(' can start Acquisition ', () => {
        expect(component.canStart(createTestAcquisitionWithStatus('PAUSED'))).toBeTrue();
    });

    it(' can not start Acquisition ', () => {
        expect(component.canStart(createTestAcquisitionWithStatus('PROVISIONING'))).toBeFalse();
        expect(component.canStart(createTestAcquisitionWithStatus('QUEUED'))).toBeFalse();
        expect(component.canStart(createTestAcquisitionWithStatus('RUNNING'))).toBeFalse();
        expect(component.canStart(createTestAcquisitionWithStatus('ERROR'))).toBeFalse();
        expect(component.canStart(createTestAcquisitionWithStatus('SUCCESS'))).toBeFalse();
    });

    it(' can not  Acquisition action ', () => {
        expect(component.hasNoAction(createTestAcquisitionWithStatus('BLABLA'))).toBeTrue();

        expect(component.hasNoAction(createTestAcquisitionWithStatus('PROVISIONING'))).toBeFalse();
        expect(component.hasNoAction(createTestAcquisitionWithStatus('QUEUED'))).toBeFalse();
        expect(component.hasNoAction(createTestAcquisitionWithStatus('RUNNING'))).toBeFalse();
        expect(component.hasNoAction(createTestAcquisitionWithStatus('PAUSED'))).toBeFalse();
    });

    it('reload data on pageChange ', () => {
        let pev: PaginationEvent = {page: 1, pageSize: 3, nbPage: 10};
        component.ngOnInit();
        component.pageChange(pev);
        expect(component.loading).toBeFalse();
        expect(component.page).toEqual(1);
        expect(component.asyncDataAcq.length).toEqual(2);
    });

    it('RunAcquisition with START ', () => {
        component.onRunAcquisition(createTestAcquisitionWithStatus('qqq'));
        expect(passedActionName).toEqual('START');
        expect(passedActionNumber).toEqual(123);
    });

    it('onPauseAcquisition with PAUSE ', () => {
        component.onPauseAcquisition(createTestAcquisitionWithStatus('qqq'));
        expect(passedActionName).toEqual('PAUSE');
        expect(passedActionNumber).toEqual(123);
    });

    it('onStopAcquisition with STOP ', () => {
        component.onStopAcquisition(createTestAcquisitionWithStatus('qqq'));
        expect(passedActionName).toEqual('STOP');
        expect(passedActionNumber).toEqual(123);
    });

    it('RunAcquisition with error then generate error message ', () => {
        let acq  = createTestAcquisitionWithStatus('qqq');
        acq.id = -100;
        component.onRunAcquisition(acq);
        expect(passedDetailMessage).toEqual('Could not AA acquisition');
        expect(passedActionNumber).toEqual(-100);
    });
});

function createTestAcquisitionWithStatus(statusAcq: string): Acquisition {
    const id: number = 123;
    return {
        'id': id,
        'workflowId': '',
        'crawlerName': 'crawler' + id,
        startDate: '',
        lastUpdateDate: '',
        status: statusAcq
    };
}

function getTestAction(): Action {
    return {
        id: 1,
        date: '01-01-01',
        success: 'true',
        action: 'AA',
        acquisitionId: 123456
    };
}
