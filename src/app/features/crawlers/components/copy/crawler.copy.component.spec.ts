import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Crawler, CrawlerService } from '../../shared';
import { createTestCrawler } from '../../shared/models/crawlers.model';
import { Observable, of, throwError } from 'rxjs';
import { CrawlerCopyComponent } from './crawler.copy.component';
import { UxAppShellService } from '@eui/core';
import { CopyCrawler } from '../../shared/models/copy-crawler.model';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

let selectedCrawlerId: number;
let copyCrawlerName: string;
let msgSummary: string;
let msgError: string;

class CrawlerServiceMock {
    getById(id: number): Observable<Crawler> {
        return of(createTestCrawler(id, 'crawler'));
    }

    copyCrawler(id: number, copyCrawler: CopyCrawler): Observable<Crawler> {
        selectedCrawlerId = id;
        copyCrawlerName = copyCrawler.name;

        if(copyCrawler.name = 'WITH_ERROR'){
            return throwError(new Error('Invalid Save'));
        }

        return of(createTestCrawler(id, 'crawler'));
    }
}

class UxAppShellServiceMock {
    state$ = of(null);
    breakpoints$ = of({
        isMobile: false
    });

    growlError(msg: string): void {
        msgError = msg;
        expect(msg).not.toBeNull();
    }

    growlSuccess(msg: string): void {
        expect(msg).not.toBeNull();
    }

    growl(msg: any, isSticky?: boolean, isMultiple?: boolean, life?: number, position?: string, callback?: () => void) {
        msgSummary = msg.summary;
    }

}

describe('CrawlerCopyComponent for copy Crawler ', function () {
    let component: CrawlerCopyComponent;
    let fixture: ComponentFixture<CrawlerCopyComponent>;
    let uxAppShellService: UxAppShellService;

    const activatedRouteMock = {
        snapshot: {
            params: {
                id: 11
            }
        }
    };

    const routerMock = {
        navigate: jasmine.createSpy('navigate')
    };

    const crawlerServiceMock = new CrawlerServiceMock();
    const uxAppShellServiceMock = new UxAppShellServiceMock();
    const formBuilder: FormBuilder = new FormBuilder();
    const locationStub = {back: jasmine.createSpy('back')};

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                CrawlerCopyComponent
            ],
            providers: [
                {provide: Router, useValue: routerMock},
                {provide: ActivatedRoute, useValue: activatedRouteMock},
                {provide: FormBuilder, useValue: formBuilder},
                {provide: CrawlerService, useValue: crawlerServiceMock},
                {provide: UxAppShellService, useValue: uxAppShellServiceMock},
                {provide: Location, useValue: locationStub},
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        uxAppShellService = TestBed.inject(UxAppShellService);
        fixture = TestBed.createComponent(CrawlerCopyComponent);
        component = fixture.componentInstance;
    });

    it('should create CrawlerCopyComponent ', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should take name on Save action ', () => {
        component.ngOnInit();
        component.onSave({});
        expect(selectedCrawlerId).toEqual(11);
        expect(copyCrawlerName).toEqual('crawler_copy');
    });

    it('on invalid form should show error on Save action ', () => {
        component.ngOnInit();
        component.form.controls.name.setValue('');
        component.onSave({});
        expect(msgError).toEqual('The form is invalid, please fix the errors');
    });

    it('should show error if not saved ', () => {
        component.ngOnInit();
        component.onSave({});
        component.form.controls.name.setValue('WITH_ERROR');
        expect(msgError + '').toEqual('Error: Invalid Save');
    });

    it('on Cancel should back ', () => {
        component.ngOnInit();
        component.onCancel({});
        expect(locationStub.back);
    });

});
