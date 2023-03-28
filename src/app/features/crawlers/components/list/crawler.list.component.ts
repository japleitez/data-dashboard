import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UxAppShellService } from '@eui/core';
import { PaginationEvent } from '@eui/components/eui-table';
import { CrawlerService, EntityArrayResponseType } from '../../shared/services/crawler.service';
import { RequestUtil, sortById } from '../../../../shared/request/request-util';
import { Crawler } from '../../shared';

@Component({
    templateUrl: './crawler.list.component.html',
})
export class CrawlerListComponent implements OnInit {
    crawlers: Crawler[] = [];
    selectedCrawler: Crawler;

    public asyncDataCrawler: any[] = [];
    public asyncDataCrawlerLength: number;
    public page = 0;
    public pageSize = 25;
    public pageSizeOptions = [5, 10, 25, 100];
    public loading = false;
    public selectedRows: any[] = [];

    constructor(private asService: UxAppShellService,
                private crawlerService: CrawlerService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.loading = true;
        this._getCrawlers(this.page, {
            page: this.page,
            size: this.pageSize,
            sort: sortById(),
        });
    }

    public pageChange(e: PaginationEvent) {
        this._getCrawlers(this.page, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    onPlayCrawler(crawler: Crawler) {
        this.router.navigate(['../acquisitions/details'], { queryParams: { crawlerName: crawler.name }, relativeTo: this.route });
    }

    onCreateCrawler(event: any) {
        this.router.navigate(['./details'], { relativeTo: this.route });
    }

    onEditCrawler(crawler: Crawler) {
        this.router.navigate(['./details', crawler.id], { relativeTo: this.route });
    }

    onEditCrawlerSources(crawler: Crawler) {
        this.router.navigate(['./details/', crawler.id, 'sources'], { relativeTo: this.route });
    }

    onCopyCrawler(crawler: Crawler) {
        this.router.navigate(['./copy', crawler.id], { relativeTo: this.route });
    }

    onImport(event: any) {
        this.router.navigate(['./import'], { relativeTo: this.route });
    }

    onDeleteCrawler(crawler: Crawler) {
        this.selectedCrawler = crawler;
        this.asService.openMessageBox('delete-crawler-confirm');
    }

    onDeleteCrawlerConfirmResponse(response: boolean) {
        if (response) {
            this.crawlerService.deleteCrawler(this.selectedCrawler.id).subscribe(
                () => {
                    this.asService.growl({
                        severity: 'success', summary: 'SUCCESS', detail: 'Crawler successfully deleted',
                    });
                    this._getCrawlers(this.page, {
                        page: this.page,
                        size: this.pageSize,
                        sort: sortById(),
                    });
                }, error => {
                    this.handleError(error);
                });
        }
    }

    private _getCrawlers(page: number, req: any) {
        this.crawlerService.getCrawlers(req).subscribe(
            (response: EntityArrayResponseType) => {
                this.asyncDataCrawlerLength = RequestUtil.getTotalLengthHeader(response);
                this.asyncDataCrawler = response.body;
                this.loading = false;
                this.page = page;
            }, error => {
                this.handleError(error);
            });
    }

    private handleError(error: any): void {
        if (error && error.summary) {
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
        } else {
            this.asService.growl({ severity: 'danger', summary: 'ERROR', detail: '' + <any>error });
        }
        this.loading = false;
    }

}
