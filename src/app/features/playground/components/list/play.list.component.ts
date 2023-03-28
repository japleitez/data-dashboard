import { Component, OnInit } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { PaginationEvent } from '@eui/components/eui-table';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaygroundService } from '../../shared/service/playground.service';
import { RequestUtil, sortById } from '../../../../shared/request/request-util';
import { UrlFilter } from '../../../../shared/components/model/url-filter.model';

@Component({
    templateUrl: './play.list.component.html',
})
export class PlayListComponent implements OnInit {

    public urlFilters: any[] = [];
    public urlFiltersLength: number;

    public pageUrl = 0;
    public pageUrlSize = 25;
    public pageUrlSizeOptions = [5, 10, 25, 100];
    public loadingUrl = false;

    public parseFilters: any[] = [];
    public parseFiltersLength: number;

    public pageParse = 0;
    public pageParseSize = 25;
    public pageParseSizeOptions = [5, 10, 25, 100];
    public loadingParse = false;

    public navigationFilters: any[] = [];
    public navigationFiltersLength: number;

    public pageNavigation = 0;
    public pageNavigationSize = 25;
    public pageNavigationSizeOptions = [5, 10, 25, 100];
    public loadingNavigation = false;

    constructor(private playgroundService: PlaygroundService,
                private asService: UxAppShellService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.reloadUrlPage();
        this.reloadParsePage();
        this.reloadNavigationPage();
    }

    pageUrlChange(e: PaginationEvent) {
        this._getUrlFilters(this.pageUrl, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    pageParseChange(e: PaginationEvent) {
        this._getParseFilters(this.pageUrl, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    pageNavigationChange(e: PaginationEvent) {
        this._getNavigationFilters(this.pageUrl, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    onUrlTest(filter: UrlFilter) {
        this.router.navigate(['./details', 'urlFilter', filter.id], { relativeTo: this.route });
    }

    onParseTest(filter: UrlFilter) {
        this.router.navigate(['./details', 'parseFilter', filter.id], { relativeTo: this.route });
    }

    onNavigationTest(filter: UrlFilter) {
        this.router.navigate(['./details', 'navigationFilter', filter.id], { relativeTo: this.route });
    }

    private reloadUrlPage() {
        this.loadingUrl = true;
        this._getUrlFilters(this.pageUrl, {
            page: this.pageUrl,
            size: this.pageUrlSize,
            sort: sortById(),
        });
    }

    private reloadParsePage() {
        this.loadingParse = true;
        this._getParseFilters(this.pageUrl, {
            page: this.pageParse,
            size: this.pageParseSize,
            sort: sortById(),
        });
    }

    private reloadNavigationPage() {
        this.loadingNavigation = true;
        this._getNavigationFilters(this.pageUrl, {
            page: this.pageNavigation,
            size: this.pageNavigationSize,
            sort: sortById(),
        });
    }

    private _getUrlFilters(page: number, req: any) {
        this.loadingUrl = true;
        this.playgroundService.getUrlFilters(req).subscribe(this.handleUrlResponse(page), this.handleError());
    }

    private _getParseFilters(page: number, req: any) {
        this.loadingParse = true;
        this.playgroundService.getParseFilters(req).subscribe(this.handleParseResponse(page), this.handleError());
    }

    private _getNavigationFilters(page: number, req: any) {
        this.loadingNavigation = true;
        this.playgroundService.getNavigationFilters(req).subscribe(this.handleNavigationResponse(page), this.handleError());
    }

    private handleUrlResponse(page: number) {
        return response => {
            this.urlFiltersLength = RequestUtil.getTotalLengthHeader(response);
            this.urlFilters = response.body;
            this.pageUrl = page;
            this.loadingUrl = false;
        };
    }

    private handleParseResponse(page: number) {
        return response => {
            this.parseFiltersLength = RequestUtil.getTotalLengthHeader(response);
            this.parseFilters = response.body;
            this.pageParse = page;
            this.loadingParse = false;
        };
    }

    private handleNavigationResponse(page: number) {
        return (response) => {
            this.navigationFiltersLength = RequestUtil.getTotalLengthHeader(response);
            this.navigationFilters = response.body;
            this.pageNavigation = page;
            this.loadingNavigation = false;
        };
    }

    private handleError() {
        return error => {
            this.loadingUrl = false;
            this.asService.growl({
                    severity: error.severity,
                    summary: error.summary,
                    detail: error.detail
                },
                error.isGrowlSticky,
                error.isGrowlMultiple,
                error.growlLife,
                error.position,
            );
        };
    }

}
