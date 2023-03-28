import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {UxAppShellService} from '@eui/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpHeaders, HttpResponse} from '@angular/common/http';

import {Crawler, CrawlerService} from '../../shared';
import {CrawlerListComponent} from './crawler.list.component';
import {Observable, of} from 'rxjs';
import {createTestCrawler, createTestCrawlerList} from '../../shared/models/crawlers.model';
import {PaginationEvent} from '@eui/components/eui-table';
import { throwError} from 'rxjs';
import { CoreModule } from '../../../../core/core.module';
import { By } from '@angular/platform-browser';

let messageOnBox: string;
let severityMsg: string;
let detailMsg: string;

class UxAppShellServiceMock {
    state$ = of(null);

    openMessageBox(message: string) {
        messageOnBox = message;
    }

    growl(msg: any) {
        severityMsg = msg.severity;
        detailMsg = msg.detail;
    }
}

class CrawlerServiceMock {
    getById(id: number): Observable<Crawler> {
        return of(createTestCrawler(id, 'crawler'));
    }

    getCrawlers(req: any): Observable<HttpResponse<Crawler[]>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('X-Total-Count', '2');
        return of(new HttpResponse({status: 200, headers: headers, body: createTestCrawlerList(2)}));
    }

    deleteCrawler(crawlerId: number): Observable<Crawler> {
        if (crawlerId === -100) {
            return throwError('error!');
        }
        return of(createTestCrawler(222, 'dummy_deleted'));
    }
}

describe('Crawler List Component Test', () => {
    let component: CrawlerListComponent;
    let fixture: ComponentFixture<CrawlerListComponent>;
    let routerSpy;
    let uxAppShellService: UxAppShellService;
    const crawlerServiceMock = new CrawlerServiceMock();
    const uxAppShellServiceMock = new UxAppShellServiceMock();

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [
                CrawlerListComponent
            ],
            imports: [
                CoreModule,
            ],
            providers: [
                {provide: CrawlerService, useValue: crawlerServiceMock},
                {provide: Router, useValue: routerSpy},
                {provide: UxAppShellService, useValue: uxAppShellServiceMock},
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
        fixture = TestBed.createComponent(CrawlerListComponent);

        component = fixture.componentInstance;

        messageOnBox = '';
        severityMsg = '';
        detailMsg = '';
    });

    it('Crawler List component shall be created', () => {
        expect(component).toBeTruthy();
    });

    it('shall navigate to Crawler Details page when onCreateSource is clicked', fakeAsync( () => {
        component.ngOnInit();
        fixture.detectChanges();
        let btn = fixture.debugElement.query(By.css('#create_crawler')) as DebugElement;
        btn = btn.query(By.css('button')) as DebugElement;
        btn.triggerEventHandler('click', null);
        tick(); // simulates the passage of time until all pending asynchronous activities finish
        fixture.detectChanges();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['./details'], jasmine.any(Object));
    }));

    it(' route to the detail path after Create', () => {
        component.ngOnInit();
        component.onCreateCrawler({});
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./details');
    });

    it(' route to the detail path after Edit', () => {
        component.ngOnInit();
        component.onEditCrawler(createTestCrawler(123, 'crawler'));
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./details');
        expect(routerSpy.navigate.calls.first().args[0]).toContain(123);
    });

    it(' route to the detail with sources path after CrawlerSources', () => {
        component.ngOnInit();
        component.onEditCrawlerSources(createTestCrawler(123, 'crawler'));
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./details/');
        expect(routerSpy.navigate.calls.first().args[0]).toContain(123);
        expect(routerSpy.navigate.calls.first().args[0]).toContain('sources');
    });

    it(' route to the copy path after Copy', () => {
        component.onCopyCrawler(createTestCrawler(123, 'crawler'));
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./copy');
        expect(routerSpy.navigate.calls.first().args[0]).toContain(123);
    });

    it(' route to the import path after Import', () => {
        component.onImport({});
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./import');
    });

    it(' open popup message after Delete Crawler', () => {
        component.onDeleteCrawler(createTestCrawler(123, 'crawler'));
        expect(component.selectedCrawler.id).toEqual(123);
        expect(messageOnBox).toEqual('delete-crawler-confirm');
    });

    it(' route to the acquisition details path after Start', () => {
        component.onPlayCrawler(createTestCrawler(123, 'crawler123'));
        expect(routerSpy.navigate.calls.first().args[0]).toContain('../acquisitions/details');
        expect(routerSpy.navigate.calls.first().args[1].queryParams.crawlerName).toEqual('crawler123');
    });

    it('reload data on pageChange ', () => {
        let pev: PaginationEvent = {page: 1, pageSize: 3, nbPage: 10};
        component.ngOnInit();
        component.pageChange(pev);
        expect(component.loading).toBeFalse();
        expect(component.page).toEqual(0);
        expect(component.asyncDataCrawler.length).toEqual(2);
    });

    it(' Delete Crawler action ', () => {
        component.onDeleteCrawler(createTestCrawler(123, 'crawler'));
        component.onDeleteCrawlerConfirmResponse(true);
        expect(component.selectedCrawler.id).toEqual(123);
        expect(messageOnBox).toEqual('delete-crawler-confirm');
        expect(detailMsg).toEqual('Crawler successfully deleted');
    });

    it(' Delete Crawler action with error test ', () => {
        component.onDeleteCrawler(createTestCrawler(-100, 'crawler'));
        component.onDeleteCrawlerConfirmResponse(true);
        expect(component.selectedCrawler.id).toEqual(-100);
        expect(messageOnBox).toEqual('delete-crawler-confirm');
        expect(detailMsg).toEqual('error!');
    });

});
