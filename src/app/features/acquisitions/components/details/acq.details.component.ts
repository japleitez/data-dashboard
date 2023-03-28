import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { UxAppShellService } from '@eui/core';
import { markFormGroupTouched } from '@eui/core';

import { Acquisition } from '../../shared/models/acquisition.model';
import { AcquisitionService } from '../../shared/services/acquisition.service';
import { nameRegexValidator } from '../../../../shared/validators/name-regex.directive';

import { v4 as uuidv4 } from '../../../../shared/util/uuid';

@Component({
    templateUrl: './acq.details.component.html',
})
export class AcqDetailsComponent implements OnInit {
    form: FormGroup;
    crawlerName: string;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private acquisitionService: AcquisitionService,
        private asService: UxAppShellService,
        private location: Location
    ) {}

    ngOnInit() {
        this.readCrawlerName();
        this._buildForm();
    }

    readCrawlerName() {
        this.route.queryParams.subscribe((params) => {
            this.crawlerName = params['crawlerName'];
        });
    }

    onStart(event: any): void {
        markFormGroupTouched(this.form.controls);

        if (!this.form.valid) {
            this.asService.growlError('The form is invalid, please fix the errors');
        } else {
            this.acquisitionService.createAcquisition(this.form.value).subscribe(
                (acquisition: Acquisition) => {
                    this.asService.growlSuccess('Data Acquisition successfully created');
                    this.location.back();
                }, this.handleError());
        }
    }

    onCancel(event: any): void {
        this.location.back();
    }

    onAdminRoleToggled(checked: boolean) {
        this.form.patchValue({
            isAdmin: checked,
        });
    }

    private _buildForm() {
        this.form = this.fb.group({
            'name': [this.crawlerName, Validators.compose([Validators.required, nameRegexValidator(), Validators.maxLength(100)])],
            'uuid': [uuidv4(), Validators.compose([Validators.required])],
        });
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
        };
    }

}
