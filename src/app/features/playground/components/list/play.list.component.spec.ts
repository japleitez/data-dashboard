import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { PlayListComponent } from './play.list.component';
import { Observable, of } from 'rxjs';
import { PaginationEvent } from '@eui/components/eui-table';
import { PlaygroundService } from '../../shared/service/playground.service';
import { UrlFilter } from '../../../../shared/components/model/url-filter.model';

let messageOnBox: string = '';
let msgSummary: string = '';

class UxAppShellServiceMock {
    state$ = of(null);

    openMessageBox(message: string) {
        messageOnBox = message;
    }

    growl(msg: any, isSticky?: boolean, isMultiple?: boolean, life?: number, position?: string, callback?: () => void) {
        msgSummary = msg.summary;
    }
}

class PlaygroundServiceMock {

    getUrlFilters(req: any): Observable<HttpResponse<UrlFilter[]>> {
        let list: UrlFilter[] = [getUrlFilter(1), getUrlFilter(2)];
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('X-Total-Count', '2');
        return of(new HttpResponse({ status: 200, headers: headers, body: list }));
    }

    getParseFilters(req: any): Observable<HttpResponse<UrlFilter[]>> {
        let list: UrlFilter[] = [getUrlFilter(1), getUrlFilter(2)];
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('X-Total-Count', '2');
        return of(new HttpResponse({ status: 200, headers: headers, body: list }));
    }

    getNavigationFilters(req: any): Observable<HttpResponse<UrlFilter[]>> {
        let list: UrlFilter[] = [getUrlFilter(1), getUrlFilter(2)];
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('X-Total-Count', '2');
        return of(new HttpResponse({ status: 200, headers: headers, body: list }));
    }

}

function getUrlFilter(id: number): UrlFilter {
    return { id: 'v' + id, name: { default: 'v' + id, translationKey: 'v' + id } };
}

describe('Playground ListComponent Test', () => {
    let component: PlayListComponent;
    let fixture: ComponentFixture<PlayListComponent>;
    let routerSpy;
    let uxAppShellService: UxAppShellService;
    let playgroundServiceMock;

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        playgroundServiceMock = new PlaygroundServiceMock();

        TestBed.configureTestingModule({
            declarations: [
                PlayListComponent
            ],
            providers: [
                { provide: PlaygroundService, useValue: playgroundServiceMock},
                { provide: UxAppShellService, useClass: UxAppShellServiceMock },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: {
                        snapshot: {
                            paramMap: {
                                get(): string {
                                    return 'fake';
                                },
                            },
                        },
                    }}
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        uxAppShellService = TestBed.inject(UxAppShellService);

        fixture = TestBed.createComponent(PlayListComponent);

        component = fixture.componentInstance;
    });

    it('component shall be created', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it(' route to URL Filter details when onTest is clicked for URL Filter ', () => {
        let item = getUrlFilter(1);
        component.onUrlTest(item);
        expect(routerSpy.navigate.calls.first().args[0][0]).toEqual('./details');
        expect(routerSpy.navigate.calls.first().args[0][1]).toEqual('urlFilter');
    });

    it(' route to PARSE Filter details when onTest is clicked for PARSE Filter ', () => {
        let item = getUrlFilter(1);
        component.onParseTest(item);
        expect(routerSpy.navigate.calls.first().args[0][0]).toEqual('./details');
        expect(routerSpy.navigate.calls.first().args[0][1]).toEqual('parseFilter');
    });

    it(' route to Navigation Filter details when onTest is clicked for NAVIGATION Filter ', () => {
        let item = getUrlFilter(1);
        component.onNavigationTest(item);
        expect(routerSpy.navigate.calls.first().args[0][0]).toEqual('./details');
        expect(routerSpy.navigate.calls.first().args[0][1]).toEqual('navigationFilter');
    });

    it('can change page on event', () => {
        let pev: PaginationEvent = { page: 1, pageSize: 20, nbPage: 10 };
        component.ngOnInit();
        component.pageUrlChange(pev);
        expect(component.loadingUrl).toBeFalse();
        expect(component.pageUrl).toEqual(0);
        expect(component.urlFilters.length).toEqual(2);
        expect(component.urlFiltersLength).toEqual(0);
    });

});
