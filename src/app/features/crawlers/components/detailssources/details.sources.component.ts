import { Component, OnInit } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { PaginationEvent } from '@eui/components/eui-table';
import { Source, SourceService } from '../../../sources/shared';
import { RequestUtil, sortById } from '../../../../shared/request/request-util';
import { EntityArrayResponseType } from '../../../sources/shared/services/source.service';
import { Crawler, CrawlerService } from '../../shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './details.sources.component.html',
})
export class DetailsSourcesComponent implements OnInit {
    sources: Source[] = [];
    selectedSource: Source;

    public asyncDataSource: any[] = [];
    public asyncDataSourceLength: number;
    public page = 0;
    public pageSize = 25;
    public pageSizeOptions = [5, 10, 25, 100];
    public loading = false;
    public selectedRows: any[] = [];

    public asyncDataAllSource: any[] = [];
    public asyncDataAllSourceLength: number;
    public pageAllSources = 0;
    public pageSizeAllSources = 10;
    public pageSizeOptionsAllSources = [5, 10, 25, 100];
    public loadingAllSources = false;
    public selectedRowsAllSources: Source[] = [];

    public currentCrawlerId;
    public currentCrawler: Crawler;

    constructor(private asService: UxAppShellService,
                private crawlerService: CrawlerService,
                private sourceService: SourceService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.currentCrawlerId = this.route.snapshot.params['id'];
        this._getCrawler(this.currentCrawlerId);

        this.loading = true;
        this.loadCrawlerSources();

        this.loadingAllSources = true;
        this.loadAllSources();
    }

    loadCrawlerSources() {
        this._getSources(this.page, {
            page: this.page,
            size: this.pageSize,
            sort: sortById(),
        });
    }

    loadAllSources() {
        this._getAllSources(this.pageAllSources, {
            page: this.pageAllSources,
            size: this.pageSizeAllSources,
            sort: sortById(),
        });
    }

    public onSelectedRowsAllSources(selected: any[]) {
        this.selectedRowsAllSources = selected;
    }

    public pageChangeAllSources(e: PaginationEvent) {
        this._getAllSources(this.pageAllSources, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    public isSelectedFromAllSources(source: Source): boolean {
        return this.selectedRowsAllSources?.filter(selected => selected?.id === source?.id).length === 1;
    }

    public pageChange(e: PaginationEvent) {
        this._getSources(this.page, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    onRemoveSourceFromCrawler(source: Source) {
        this.selectedSource = source;
        this.asService.openMessageBox('remove-source-confirm');
    }

    onRemoveSourceFromCrawlerAction(response: boolean) {
        if (response) {
            this.crawlerService.deleteSourcesForCrawler(this.currentCrawlerId, this.selectedSource.id).subscribe(
                () => {
                    this.asService.growl({
                        severity: 'success',
                        summary: 'SUCCESS',
                        detail: 'Source successfully removed',
                    }, false, true, );
                    this._getSources(this.page, {
                        page: this.page,
                        size: this.pageSize,
                        sort: sortById(),
                    });
                }, error => {
                    this.handleError(error);
                });
        }
    }

    public addSelectedSources() {
        this._saveSourcesListForCrawler(this.selectedRowsAllSources);
    }

    public onSaveSource(source: Source) {
        this._saveSourcesListForCrawler([source]);
    }

    private _saveSourcesListForCrawler(sourceList: Source[]) {
        sourceList.forEach(source => {
            this.crawlerService.saveSourcesForCrawler(this.currentCrawlerId, source.id).subscribe(
                () => {
                    this.asService.growl({
                        severity: 'success',
                        summary: 'SUCCESS',
                        detail: 'Source successfully stored'
                    }, false, true, );
                    this.loadCrawlerSources();
                }, error => {
                    this.handleError(error);
                });
        });
    }

    private _getSources(page: number, req: any) {
        this.crawlerService.getSourcesForCrawler(this.currentCrawlerId, req).subscribe(
            (response: EntityArrayResponseType) => {
                this.asyncDataSourceLength = RequestUtil.getTotalLengthHeader(response);
                this.asyncDataSource = response.body;
                this.loading = false;
                this.page = page;
            }, error => {
                this.handleError(error);
            });
    }

    private _getAllSources(page: number, req: any) {
        this.sourceService.getSources(req).subscribe(
            (response: EntityArrayResponseType) => {
                this.asyncDataAllSourceLength = RequestUtil.getTotalLengthHeader(response);
                this.asyncDataAllSource = response.body;
                this.loadingAllSources = false;
                this.pageAllSources = page;
            }, error => {
                this.handleError(error);
            });
    }

    private _getCrawler(crawlerId: number) {
        this.crawlerService.getById(crawlerId).subscribe(
            (crawler: Crawler) => {
                this.currentCrawler = crawler;
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
            this.asService.growl({ severity: 'danger', summary: 'ERROR', detail: '' + <any>error },
                error.isGrowlSticky,
                error.isGrowlMultiple,
                error.growlLife,
                error.position,
            );
        }
        this.loading = false;
    }

}
