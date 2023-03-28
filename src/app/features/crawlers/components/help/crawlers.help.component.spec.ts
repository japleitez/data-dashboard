import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CrawlersHelpComponent } from './crawlers.help.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CrawlersHelpComponent Test', () => {
    let component: CrawlersHelpComponent;
    let fixture: ComponentFixture<CrawlersHelpComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                CrawlersHelpComponent
            ],
            providers: [
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(CrawlersHelpComponent);
        component = fixture.componentInstance;
    });

    it('CrawlersHelpComponent shall be created', () => {
        expect(component).toBeTruthy();
    });

});
