import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Crawler, CrawlerService } from '../../shared';
import { Source, SourceService } from '../../../sources/shared';
import { Observable, of } from 'rxjs';
import { DetailsSourcesComponent } from './details.sources.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UxAppShellService } from '@eui/core';

import { HttpResponse } from '@angular/common/http';
import { RouterMock } from '../../../../shared/testing/router.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { createTestCrawler } from '../../shared/models/crawlers.model';

let selectedCrawlerId: number;
let latestSourceId: number;
let messageOnBox: string;
let msgSummary: string;

class CrawlerServiceMock {
    getById(id: number): Observable<Crawler> {
        return of(createTestCrawler(id, 'crawler'));
    }

    getSourcesForCrawler(crawlerId: number, req: any): Observable<HttpResponse<Source[]>> {
        let items = createTestCrawler(crawlerId, 'crawler').sources;
        return of(new HttpResponse({ status: 200, body: items }));
    }

    saveSourcesForCrawler(crawlerId: number, sourceId: number): Observable<any> {
        selectedCrawlerId = crawlerId;
        latestSourceId = sourceId;
        return of(createTestCrawler(1, 'dummy'));
    }

    deleteSourcesForCrawler(crawlerId: number, sourceId: number): Observable<HttpResponse<Crawler>> {
        selectedCrawlerId = crawlerId;
        latestSourceId = sourceId;
        return of(new HttpResponse({ status: 200, body: createTestCrawler(1, 'dummy') }));
    }
}

class SourceServiceMock {
    getSources(req: any): Observable<HttpResponse<Source[]>> {
        let sourcesList: Source[] = [getTestSource(1), getTestSource(2)];
        return of(new HttpResponse({ status: 200, body: sourcesList }));
    }
}

function getTestSource(id: number): Source {
    return {'id': id, 'name': 'source_' + id, 'url': 'https://source' + id + '.com'};
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

    growl(msg: any, isSticky?: boolean, isMultiple?: boolean, life?: number, position?: string, callback?: () => void) {
        msgSummary = msg.summary;
    }

    openMessageBox(message: string) {
        messageOnBox = message;
    }
}

describe('DetailsSourcesComponent for Sources in Crawler ', function () {
    let component: DetailsSourcesComponent;
    let fixture: ComponentFixture<DetailsSourcesComponent>;
    let uxAppShellService: UxAppShellService;

    const sourceServiceMock = new SourceServiceMock();
    const crawlerServiceMock = new CrawlerServiceMock();
    const uxAppShellServiceMock = new UxAppShellServiceMock();
    const activatedRouteMock = {
        snapshot: {
            params: {
                id: 11
            }
        }
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DetailsSourcesComponent
            ],
            providers: [
                provideMockStore({ }),
                {provide: UxAppShellService, useValue: uxAppShellServiceMock},
                {provide: Router, useClass: RouterMock },
                {provide: ActivatedRoute, useValue: activatedRouteMock},
                {provide: SourceService, useValue: sourceServiceMock},
                {provide: CrawlerService, useValue: crawlerServiceMock},
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        uxAppShellService = TestBed.inject(UxAppShellService);
        selectedCrawlerId = 0;
        latestSourceId = 0;
        fixture = TestBed.createComponent(DetailsSourcesComponent);
        component = fixture.componentInstance;
        component.selectedRowsAllSources = [];
        component.currentCrawlerId = 0;
    });

    it('should create Source Details component ', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should correctly detect selected Source items ', () => {
        component.ngOnInit();
        component.onSelectedRowsAllSources([getTestSource(1)]);

        expect(component.isSelectedFromAllSources(getTestSource(1))).toBeTruthy();
        expect(component.isSelectedFromAllSources(getTestSource(2))).toBeFalse();
    });

    it('should correctly selected Sources ', () => {
        component.ngOnInit();
        component.onSelectedRowsAllSources([getTestSource(3)]);
        component.addSelectedSources();

        expect(selectedCrawlerId).toEqual(11);
        expect(latestSourceId).toEqual(3);
    });

    it('should correctly selected single Source ', () => {
        component.ngOnInit();
        component.onSaveSource(getTestSource(3));

        expect(selectedCrawlerId).toEqual(11);
        expect(latestSourceId).toEqual(3);
    });

    it('should correctly remove Source ', () => {
        component.ngOnInit();
        component.onRemoveSourceFromCrawler(getTestSource(12));
        component.onRemoveSourceFromCrawlerAction(true);

        expect(selectedCrawlerId).toEqual(11);
        expect(latestSourceId).toEqual(12);
        expect(messageOnBox).toEqual('remove-source-confirm');
    });

    it('should not remove Source if click No', () => {
        component.ngOnInit();
        component.onRemoveSourceFromCrawler(getTestSource(12));
        component.onRemoveSourceFromCrawlerAction(false);

        expect(selectedCrawlerId).toEqual(0);
        expect(latestSourceId).toEqual(0);
        expect(messageOnBox).toEqual('remove-source-confirm');
    });
});
