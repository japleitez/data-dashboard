import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CoreModule } from '../../../../core/core.module';
import { SourceDetailsComponent } from './source.details.component';
import { Source, SourceService } from '../../shared';
import { UxAppShellService } from '@eui/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {Observable, of, throwError} from 'rxjs';

let msgSummary: string;

class SourceServiceMock {
    getById(id: number): Observable<Source> {
        return of({
            'id': id,
            'name': 'Eurostat',
            'url': 'https://ec.europa.eu/eurostat'
        });
    }

    saveSource(source: Source): Observable<Source> {
        source.id = 2;
        return of(source);
    }
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
    growl(msg: any) {
        msgSummary = msg.summary;
    }
}

describe('SourcesDetailsComponent for existing Source', () => {
    let component: SourceDetailsComponent;
    let fixture: ComponentFixture<SourceDetailsComponent>;
    const formBuilder: FormBuilder = new FormBuilder();
    const locationStub = { back: jasmine.createSpy('back') };
    const activatedRouteMock = {
        snapshot: {
            params: {
                id: 1
            }
        }
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SourceDetailsComponent
            ],
            imports: [
                CoreModule,
            ],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: FormBuilder, useValue: formBuilder },
                { provide: SourceService, useClass: SourceServiceMock },
                { provide: UxAppShellService, useClass: UxAppShellServiceMock },
                { provide: Location, useValue: locationStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create Source Details form', () => {
        expect(component).toBeTruthy();
        expect(component.form).not.toEqual(null);
        expect(component.currentSource).not.toEqual(null);
    });
});

describe('SourcesDetailsComponent for new Source', () => {
    let component: SourceDetailsComponent;
    let fixture: ComponentFixture<SourceDetailsComponent>;
    const formBuilder: FormBuilder = new FormBuilder();
    const locationStub = { back: jasmine.createSpy('back') };
    const activatedRouteMock = {
        snapshot: {
            params: {
            }
        }
    };
    const sourceServiceMock = new SourceServiceMock();
    const asServiceMock = new UxAppShellServiceMock();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SourceDetailsComponent
            ],
            imports: [
                CoreModule, ReactiveFormsModule,
            ],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: FormBuilder, useValue: formBuilder },
                { provide: SourceService, useValue: sourceServiceMock },
                { provide: UxAppShellService, useValue: asServiceMock },
                { provide: Location, useValue: locationStub }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should set currentSource to null if route param id is not present', () => {
        expect(component).toBeTruthy();
        expect(component.currentSource).toBeUndefined();
    });

    it('should call saveSource when submitting a VALID new Source', waitForAsync( () => {
        let validSource: Source = { id: null, name: 'source', url: 'https://source.com' };
        let saveSourceSpy = spyOn(sourceServiceMock, 'saveSource').and.callThrough();
        component.form.controls.name.setValue(validSource.name);
        component.form.controls.url.setValue(validSource.url);

        component.onSave(new Event('click'));
        fixture.detectChanges();

        expect(component.form.controls.name.errors).toBeNull();
        expect(component.form.controls.url.errors).toBeNull();
        expect(saveSourceSpy).toBeDefined();
        expect(saveSourceSpy).toHaveBeenCalled();
    }));

    it('should call saveSource when submitting a INVALID new Source', waitForAsync( () => {
        let invalidSource: Source = { id: null, name: 'noGoodName$', url: null };
        let growlErrorSpy = spyOn(asServiceMock, 'growlError').and.callThrough();
        component.form.controls.name.setValue(invalidSource.name);
        component.form.controls.url.setValue(invalidSource.url);

        component.onSave(new Event('click'));
        fixture.detectChanges();

        expect(component.form.controls.name.errors).not.toBeNull();
        expect(component.form.controls.url.errors).not.toBeNull();
        expect(growlErrorSpy).toBeDefined();
        expect(growlErrorSpy).toHaveBeenCalled();
    }));

    it('should show error if not saved ', waitForAsync( () => {
        let validSource: Source = { id: null, name: 'source', url: 'https://source.com' };
        let saveSourceSpy = spyOn(sourceServiceMock, 'saveSource').and.callFake(() => {
                return throwError(new Error('Invalid file'));
        });
        component.form.controls.name.setValue(validSource.name);
        component.form.controls.url.setValue(validSource.url);

        component.onSave(new Event('click'));
        fixture.detectChanges();

        expect(msgSummary).toEqual('ERROR');
    }));

    it('on Cancel should back ', () => {
        component.ngOnInit();
        component.onCancel({});
        expect(locationStub.back);
    });
});
