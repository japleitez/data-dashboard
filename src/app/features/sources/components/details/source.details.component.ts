import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { UxAppShellService } from '@eui/core';
import { markFormGroupTouched } from '@eui/core';

import { Source } from '../../shared/models/source.model';
import { SourceService } from '../../shared/services/source.service';
import { nameRegexValidator } from '../../../../shared/validators/name-regex.directive';

@Component({
    templateUrl: './source.details.component.html',
})
export class SourceDetailsComponent implements OnInit {
    form: FormGroup;
    currentSource: Source;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private sourceService: SourceService,
        private asService: UxAppShellService,
        private location: Location
    ) {}

    ngOnInit() {
        this._buildForm();
        this._getSource();
    }

    onSave(event: any): void {
        markFormGroupTouched(this.form.controls);

        if (!this.form.valid) {
            this.asService.growlError('The form is invalid, please fix the errors');
        } else {
            this.sourceService.saveSource(this.form.value).subscribe(
                (source: Source) => {
                    this.asService.growlSuccess('Source successfully saved');
                    this.location.back();
                }, error => { this.handleError(error); } );
        }
    }

    onCancel(event: any): void {
        this.location.back();
    }

    private _buildForm() {
        this.form = this.fb.group({
            'id': [null],
            'name': [null, Validators.compose([Validators.required, nameRegexValidator(), Validators.maxLength(100)])],
            'url': [null, Validators.compose([Validators.required])],
        });
    }

    private _getSource() {
        const id = this.route.snapshot.params['id'];

        if (id) {
            this.sourceService.getById(id).subscribe(
                (source: Source) => {
                    this.currentSource = source;
                    this.form.setValue({
                        id: source.id,
                        name: source.name,
                        url: source.url,
                    });
                }, error => { this.handleError(error); } );
        }
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
    }

}
