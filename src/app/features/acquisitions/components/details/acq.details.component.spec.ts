/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CoreModule} from '../../../../core/core.module';
import { AcqDetailsComponent} from './acq.details.component';
import { Acquisition, AcquisitionService} from '../../shared';
import { UxAppShellService } from '@eui/core';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CreateAcquisition } from '../../shared/models/acquisition.model';
import { createTestAcquisition } from '../../shared/test_data/acquisition.testdata';

let acquisitionName: string = '';
let messageString: string = '';
let errorMessageString: string = '';

class AcquisitionServiceMock {
    getById() {
        return of({
            'name': 'crawler1',
            'uuid': '2aea7489-111b-4e4f-b85c-5d66e78d73c3'
        });
    }

    createAcquisition(createAcquisition: CreateAcquisition): Observable<Acquisition> {
        acquisitionName = createAcquisition.name;
        return of(createTestAcquisition(100));
    }
}

class UxAppShellServiceMock {
    state$ = of(null);

    breakpoints$ = of({
        isMobile: false
    });

    growlSuccess(msg: string) {
        messageString = msg;
    }

    growlError(msg: string): void {
        expect(msg).not.toBeNull();
        errorMessageString = msg;
    }
}

const activatedRouteMock = {
    queryParams: of({
        crawlerName: 'crawler1'
    }),
};

describe('AcquisitionsDetailsComponent (new) ', () => {
    let component: AcqDetailsComponent;
    let fixture: ComponentFixture<AcqDetailsComponent>;
    const formBuilder: FormBuilder = new FormBuilder();
    const acquisitionServiceMock = new AcquisitionServiceMock();
    const locationStub = {back: jasmine.createSpy('back')};

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                AcqDetailsComponent
            ],
            imports: [
                CoreModule,
            ],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRouteMock },
                {provide: FormBuilder, useValue: formBuilder},
                {provide: AcquisitionService, useValue: acquisitionServiceMock},
                {provide: UxAppShellService, useClass: UxAppShellServiceMock},
                {provide: Location, useValue: locationStub}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AcqDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should set current acquisition as null if route param id is not present', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should show message after save ', () => {
        component.ngOnInit();
        component.form.controls.name.setValue('name_test');
        component.form.controls.uuid.setValue('11223344');
        component.onStart({});

        expect(acquisitionName).toEqual('name_test');
        expect(messageString).toEqual('Data Acquisition successfully created');
    });

    it('should show error message for saving empty form ', () => {
        component.ngOnInit();
        component.form.controls.name.setValue('');
        component.onStart({});

        expect(errorMessageString).toEqual('The form is invalid, please fix the errors');
    });

});
