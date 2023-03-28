import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UxAppShellService } from '@eui/core';
import { PaginationEvent } from '@eui/components/eui-table';
import { EntityArrayResponseType, SourceService } from '../../shared/services/source.service';
import { Source } from '../../shared';
import { RequestUtil, sortById } from '../../../../shared/request/request-util';

@Component({
    templateUrl: './source.list.component.html',
})
export class SourceListComponent implements OnInit {
    sources: Source[] = [];
    selectedSource: Source;

    public asyncDataSource: any[] = [];
    public asyncDataSourceLength: number;
    public page = 0;
    public pageSize = 25;
    public pageSizeOptions = [5, 10, 25, 100];
    public loading = false;
    public selectedRows: any[] = [];

    constructor(private asService: UxAppShellService,
                private sourceService: SourceService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.loading = true;
        this._getSources(this.page, {
            page: this.page,
            size: this.pageSize,
            sort: sortById(),
        });
    }

    public pageChange(e: PaginationEvent) {
        this._getSources(this.page, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    onCreateSource(event: any) {
        this.router.navigate(['./details'], { relativeTo: this.route });
    }

    onImport(event: any) {
        this.router.navigate(['./import'], { relativeTo: this.route });
    }

    onEditSource(source: Source) {
        this.router.navigate(['./details', source.id], { relativeTo: this.route });
    }

    onDeleteSource(source: Source) {
        this.selectedSource = source;
        this.asService.openMessageBox('delete-source-confirm');
    }

    onDeleteSourceConfirmResponse(response: boolean) {
        if (response) {
            this.sourceService.deleteSource(this.selectedSource.id).subscribe(
                () => {
                    this.asService.growl({ severity: 'success', summary: 'SUCCESS', detail: 'Source successfully deleted',
                    });
                    this._getSources(this.page, {
                        page: this.page,
                        size: this.pageSize,
                        sort: sortById(),
                    });
                }, error => { this.handleError(error); } );
        }
    }

    private _getSources(page: number, req: any) {
        this.sourceService.getSources(req).subscribe(
            (response: EntityArrayResponseType) => {
                this.asyncDataSourceLength = RequestUtil.getTotalLengthHeader(response);
                this.asyncDataSource = response.body;
                this.loading = false;
                this.page = page;
            }, error => { this.handleError(error); } );
    }

    private handleError(error: any): void {
        if (error && error.summary) {
            this.asService.growl({
                    severity: error.severity,
                    summary: error.summary,
                    detail: error.detail },
                error.isGrowlSticky,
                error.isGrowlMultiple,
                error.growlLife,
                error.position,
            );
        } else {
            this.asService.growl({ severity: 'danger', summary: 'ERROR', detail: '' + <any> error });
        }
        this.loading = false;
    }

}
