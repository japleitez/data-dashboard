import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Source, SourceService } from '../../shared';
import { SourceListComponent } from './source.list.component';
import { Observable, of } from 'rxjs';
import { PaginationEvent } from '@eui/components/eui-table';
import { CoreModule } from '../../../../core/core.module';

let messageOnBox: string = '';
let msgSummary: string = '';

class UxAppShellServiceMock {
    state$ = of(null);

    openMessageBox(message: string){
        messageOnBox = message;
    }

    growl(msg: any, isSticky?: boolean, isMultiple?: boolean, life?: number, position?: string, callback?: () => void) {
        msgSummary = msg.summary;
    }
}

class SourceServiceMock {
    getSources(req: any): Observable<HttpResponse<Source[]>> {
        let sourcesList: Source[] = [getTestSource(1), getTestSource(2)];
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('X-Total-Count', '2');

        return of(new HttpResponse({ status: 200,  headers: headers ,  body: sourcesList }));
    }

    deleteSource(sourceId: number): Observable<Source> {
        return of(getTestSource(11));
    }
}

function getTestSource(id: number): Source {
    return { 'id': id, 'name': 'source_' + id, 'url': 'https://source' + id + '.com' };
}

describe('Source ListComponent Test', () => {
    let component: SourceListComponent;
    let fixture: ComponentFixture<SourceListComponent>;
    let routerSpy;

    let uxAppShellService: UxAppShellService;
    let sources: Source[] = [
        { id: 1, name: 'source1', url: 'https://source1' },
        { id: 2, name: 'source2', url: 'https://source2' },
        { id: 3, name: 'source3', url: 'https://source3' },
        { id: 4, name: 'source4', url: 'https://source4' },
        { id: 5, name: 'source5', url: 'https://source5' },
    ];
    let sourceServiceMock;

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        sourceServiceMock = new SourceServiceMock();

        TestBed.configureTestingModule({
            declarations: [
                SourceListComponent
            ],
            imports: [
                CoreModule,
            ],
            providers: [
                { provide: SourceService, useValue: sourceServiceMock },
                { provide: Router, useValue: routerSpy },
                { provide: UxAppShellService, useClass: UxAppShellServiceMock },
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

        fixture = TestBed.createComponent(SourceListComponent);

        component = fixture.componentInstance;
        msgSummary = '';
        msgSummary = '';
    });

    it('component shall be created', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('shall navigate to details page when onCreateSource is clicked', fakeAsync(() => {
        component.ngOnInit();
        fixture.detectChanges();

        // Xpath = //*[@id="create_source"]/div/button[1]
        let btn = fixture.debugElement.query(By.css('#create_source')) as DebugElement;
        btn = btn.query(By.css('button')) as DebugElement;
        btn.triggerEventHandler('click', null);

        tick(); // simulates the passage of time until all pending asynchronous activities finish
        fixture.detectChanges();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['./details'], jasmine.any(Object));
    }));

    it(' route to details when onCreateSource is clicked', () => {
        component.onCreateSource({});
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./details');
    });

    it(' route to import when onImport is clicked', () => {
        component.onImport({});
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./import');
    });

    it(' route to details with id when onEditSource is clicked', () => {
        component.onEditSource({ id: 1234, name: 'source1', url: 'https://source1' });
        expect(routerSpy.navigate.calls.first().args[0]).toContain('./details');
        expect(routerSpy.navigate.calls.first().args[0]).toContain(1234);
    });

    it(' when onDeleteSource is clicked then MessageBox with message ', () => {
        component.onDeleteSource({ id: 1234, name: 'source1', url: 'https://source1' });
        expect(component.selectedSource.id).toEqual(1234);
        expect(messageOnBox).toEqual('delete-source-confirm');
    });

    it('can change page on event', () => {
        let pev: PaginationEvent = { page: 1, pageSize: 3, nbPage: 10 };
        component.ngOnInit();
        component.pageChange(pev);
        expect(component.loading).toBeFalse();
        expect(component.page).toEqual(0);
        expect(component.asyncDataSource.length).toEqual(2);
        expect(component.asyncDataSourceLength).toEqual(0);
    });

    it('can delete source ', () => {
        component.ngOnInit();
        component.onDeleteSource({ id: 1234, name: 'source1', url: 'https://source1' });
        component.onDeleteSourceConfirmResponse(true);
        expect(msgSummary).toEqual('SUCCESS');
    });

    it('can not delete source if click cancel ', () => {
        component.ngOnInit();
        component.onDeleteSource({ id: 1234, name: 'source1', url: 'https://source1' });
        component.onDeleteSourceConfirmResponse(false);
        expect(msgSummary).toEqual('');
    });

});
