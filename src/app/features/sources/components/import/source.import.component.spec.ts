import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SourceImportComponent } from './source.import.component';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, of, pipe, throwError } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { SourceService } from '../../shared';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { CoreModule } from '../../../../core/core.module';
import { UxAppShellService } from '@eui/core';
import { EuiFileUploadUtilsService } from '@eui/components/eui-file-upload';
import { Router } from '@angular/router';

class SourceServiceMock {
    getBatchImportUrl(): string {
        return '/batch/import';
    }
    getBaseUrl(): string {
        return '/api/sources';
    }
}

class UxAppShellServiceMock {
    isError = false;
    isSuccess = false;
    isWarning = false;

    state$ = of(null);
    breakpoints$ = of({
        isMobile: false
    });

    growl(msg: any): void {
    }

    growlError(error: any): void {
        this.isError = true;
        this.isSuccess = false;
        this.isWarning = false;
    }

    growlSuccess(msg: any): void {
        this.isError = false;
        this.isSuccess = true;
        this.isWarning = false;
    }

    growlWarning(msg: any): void {
        this.isError = false;
        this.isSuccess = false;
        this.isWarning = true;
    }
}

class ChangeDetectorRefMock {
    detectChanges(): void {
    }
}

class EuiFileUploadUtilsServiceMock {
    private status: string = '201';
    private progress: number = 100;

    public setStatus(iStatus: string) {
        this.status = iStatus;
    }

    public setProgress(iProgress: number) {
        this.progress = iProgress;
    }

    public sendData(data: any, APIEndPoint: string): Observable<HttpEvent<Object>> {
        if (this.status === '422') {
            return of(new HttpResponse({ status: 422, body: {} }));
        } else if (this.status === '202') {
            return of(new HttpResponse({
                status: 202,
                body: { sources: [{ name: 'invalid$', url: null, errors: null }] }
            }));
        } else {
            return of(new HttpResponse({ status: 201, body: {} }));
        }
    }

    public toResponseBody<T>() {
        return pipe(
            filter((value: any) => true),
            map((res: HttpResponse<T>) => res.body),
        );
    }

    public uploadProgress<T>(cb: (progress: number) => void) {
        return tap(() => {
            cb(this.progress);
        });
    }
}

describe('Source Import Component Test - Case 1', () => {
    let component: SourceImportComponent;
    let fixture: ComponentFixture<SourceImportComponent>;
    let routerSpy;
    const formBuilder: FormBuilder = new FormBuilder();
    const sourceServiceMock = new SourceServiceMock();
    const uxAppShellService = new UxAppShellServiceMock();
    const locationStub = { back: jasmine.createSpy('back') };
    const cdMock = new ChangeDetectorRefMock();
    const fileUploadServiceMock = new EuiFileUploadUtilsServiceMock();

    beforeEach(waitForAsync(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
        TestBed.configureTestingModule({
            declarations: [
                SourceImportComponent
            ],
            imports: [
                CoreModule
            ],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                { provide: SourceService, useValue: sourceServiceMock },
                { provide: UxAppShellService, useValue: uxAppShellService },
                { provide: Router, useValue: routerSpy },
                { provide: Location, useValue: locationStub },
                { provide: ChangeDetectorRef, useValue: cdMock },
                { provide: EuiFileUploadUtilsService, useValue: fileUploadServiceMock },
            ],
            schemas: [NO_ERRORS_SCHEMA],

        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceImportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create Source File Import form', () => {
        expect(component).toBeTruthy();
        expect(component.isImportDisabled()).toBeTruthy();
    });

    it('should import a valid file', waitForAsync(() => {

        fileUploadServiceMock.setStatus('201');
        let fileUploadSpy = spyOn(fileUploadServiceMock, 'sendData').and.callThrough();
        spyOn(component, 'isNotFormValid').and.returnValue(false);

        const fileList = [new File([''], 'sources.json', { type: 'application/json', lastModified: 2233 })];
        component.form.controls['fileToUpload'].setValue(fileList);

        expect(component.isImportDisabled()).toBeFalse();

        component.onUpload(new Event('click'));
        fixture.detectChanges();

        expect(fileUploadSpy).toBeDefined();
        expect(fileUploadSpy).toHaveBeenCalled();
        expect(component.isErrorReportVisible).toBeFalse();

        expect(uxAppShellService.isError).toBeFalse();
        expect(uxAppShellService.isWarning).toBeFalse();
        expect(uxAppShellService.isSuccess).toBeTrue();

        expect(component.isImportDisabled()).toBeTrue();
    }));
});

describe('Source Import Component Test - Case 2', () => {
    let component: SourceImportComponent;
    let fixture: ComponentFixture<SourceImportComponent>;
    let routerSpy;
    const formBuilder: FormBuilder = new FormBuilder();
    const sourceServiceMock = new SourceServiceMock();
    const uxAppShellService = new UxAppShellServiceMock();
    const locationStub = { back: jasmine.createSpy('back') };
    const cdMock = new ChangeDetectorRefMock();
    const fileUploadServiceMock = new EuiFileUploadUtilsServiceMock();

    beforeEach(waitForAsync(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
        TestBed.configureTestingModule({
            declarations: [
                SourceImportComponent
            ],
            imports: [
                CoreModule
            ],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                { provide: SourceService, useValue: sourceServiceMock },
                { provide: UxAppShellService, useValue: uxAppShellService },
                { provide: Router, useValue: routerSpy },
                { provide: Location, useValue: locationStub },
                { provide: ChangeDetectorRef, useValue: cdMock },
                { provide: EuiFileUploadUtilsService, useValue: fileUploadServiceMock },
            ],
            schemas: [NO_ERRORS_SCHEMA],

        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceImportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create Source File Import form', () => {
        expect(component).toBeTruthy();
        expect(component.isImportDisabled()).toBeTruthy();
    });

    it('should display Error Report and Warning when input file has business errors', waitForAsync(() => {

        fileUploadServiceMock.setStatus('202');
        let fileUploadSpy = spyOn(fileUploadServiceMock, 'sendData').and.callThrough();
        spyOn(component, 'isNotFormValid').and.returnValue(false);

        const fileList = [new File([''], 'sources.json', { type: 'application/json', lastModified: 2233 })];
        component.form.controls['fileToUpload'].setValue(fileList);

        expect(component.isUploading).toBeFalse();
        expect(component.isImportDisabled()).toBeFalse();

        component.onUpload(new Event('click'));
        fixture.detectChanges();

        expect(fileUploadSpy).toBeDefined();
        expect(fileUploadSpy).toHaveBeenCalled();

        expect(uxAppShellService.isError).toBeFalse();
        expect(uxAppShellService.isWarning).toBeTrue();
        expect(uxAppShellService.isSuccess).toBeFalse();

        expect(component.isUploading).toBeFalse();
        expect(component.isImportDisabled()).toBeTrue();
    }));
});

describe('Source Import Component Test - Case 3', () => {
    let component: SourceImportComponent;
    let fixture: ComponentFixture<SourceImportComponent>;
    let routerSpy;
    const formBuilder: FormBuilder = new FormBuilder();
    const sourceServiceMock = new SourceServiceMock();
    const uxAppShellService = new UxAppShellServiceMock();
    const locationStub = { back: jasmine.createSpy('back') };
    const cdMock = new ChangeDetectorRefMock();
    const fileUploadServiceMock = new EuiFileUploadUtilsServiceMock();

    beforeEach(waitForAsync(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
        TestBed.configureTestingModule({
            declarations: [
                SourceImportComponent
            ],
            imports: [
                CoreModule
            ],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                { provide: SourceService, useValue: sourceServiceMock },
                { provide: UxAppShellService, useValue: uxAppShellService },
                { provide: Router, useValue: routerSpy },
                { provide: Location, useValue: locationStub },
                { provide: ChangeDetectorRef, useValue: cdMock },
                { provide: EuiFileUploadUtilsService, useValue: fileUploadServiceMock },
            ],
            schemas: [NO_ERRORS_SCHEMA],

        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceImportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create Source File Import form', () => {
        expect(component).toBeTruthy();
        expect(component.isImportDisabled()).toBeTruthy();
    });

    it('should raise error when uploading an invalid file', waitForAsync(() => {
        fileUploadServiceMock.setStatus('201');
        let fileUploadSpy = spyOn(fileUploadServiceMock, 'sendData').and.callFake(() => {
            return throwError(new Error('Invalid file'));
        });
        spyOn(component, 'isNotFormValid').and.returnValue(false);

        const fileList = [new File([''], 'sources.json', { type: 'application/json', lastModified: 2233 })];
        component.form.controls['fileToUpload'].setValue(fileList);

        expect(component.isImportDisabled()).toBeFalse();

        component.onUpload(new Event('click'));
        fixture.detectChanges();

        expect(fileUploadSpy).toBeDefined();
        expect(fileUploadSpy).toHaveBeenCalled();
        expect(component.isInvalidFile).toBeTruthy();

        expect(component.isNotFormValid()).toBeFalse();

        expect(component.isImportDisabled()).toBeTrue();

    }));
});
