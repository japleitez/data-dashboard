import { Component, OnInit } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { PaginationEvent } from '@eui/components/eui-table';
import { EntityArrayResponseType, AcquisitionService } from '../../shared/services/acquisition.service';
import { Acquisition } from '../../shared';
import { faPause, faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import { RequestUtil, sortById } from '../../../../shared/request/request-util';
import { AcquisitionActions } from '../../shared/acquisition.actions';
import { Action } from '../../shared/models/action.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './acq.list.component.html',
})
export class AcqListComponent implements OnInit {
    acquisitions: Acquisition[] = [];
    selectedAcquisition: Acquisition;
    acquisitionActions: AcquisitionActions = new AcquisitionActions();
    faPause = faPause;
    faPlay = faPlay;
    faStop = faStop;

    public asyncDataAcq: any[] = [];
    public asyncDataAcqLength: number;
    public page = 0;
    public pageSize = 25;
    public pageSizeOptions = [5, 10, 25, 100];
    public loading = false;
    public selectedRows: any[] = [];

    constructor(private asService: UxAppShellService,
                private acquisitionService: AcquisitionService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.loading = true;
        this.reloadPage();
    }

    public pageChange(e: PaginationEvent) {
        this._getAcquisitions(e.page, {
            page: e.page,
            size: e.pageSize,
            sort: sortById(),
        });
    }

    canStop(a: Acquisition): boolean {
        return this.acquisitionActions.canStop(a);
    }

    canPause(a: Acquisition): boolean {
        return this.acquisitionActions.canPause(a);
    }

    canStart(a: Acquisition): boolean {
        return this.acquisitionActions.canStart(a);
    }

    hasNoAction(a: Acquisition): boolean {
        return this.acquisitionActions.hasNoAction(a);
    }

    onCreateAcquisition(event: any) {
        this.router.navigate(['./details'], { relativeTo: this.route });
    }

    onRunAcquisition(acquisition: Acquisition) {
        this.acquisitionService.executeAction(acquisition.id, 'START')
            .subscribe(this.successFullAction(), this.handleError());
    }

    onPauseAcquisition(acquisition: Acquisition) {
        this.acquisitionService.executeAction(acquisition.id, 'PAUSE')
            .subscribe(this.successFullAction(), this.handleError());
    }

    onStopAcquisition(acquisition: Acquisition) {
        this.acquisitionService.executeAction(acquisition.id, 'STOP')
            .subscribe(this.successFullAction(), this.handleError());
    }

    private successFullAction() {
        return (response: Action) => {
            if (response.success) {
                this.asService.growlSuccess('Data Acquisition successfully ' + response.action);
                this.reloadPage();
            } else {
                this.asService.growl({ severity: 'danger', summary: 'ERROR', detail: 'Could not ' + response.action + ' acquisition' });
            }
        };
    }

    private reloadPage() {
        this._getAcquisitions(this.page, {
            page: this.page,
            size: this.pageSize,
            sort: sortById(),
        });
    }

    private _getAcquisitions(page: number, req: any) {
        this.acquisitionService.getAcquisitions(req).subscribe(
            (response: EntityArrayResponseType) => {
                this.asyncDataAcqLength = RequestUtil.getTotalLengthHeader(response);
                this.asyncDataAcq = response.body;
                this.loading = false;
                this.page = page;
            },
            this.handleError()
        );
    }

    private handleError() {
        return error => {
            this.asService.growl({
                    severity: error.severity,
                    summary: error.summary,
                    detail: error.detail },
                error.isGrowlSticky,
                error.isGrowlMultiple,
                error.growlLife,
                error.position,
            );
            this.loading = false;
        };
    }
}
