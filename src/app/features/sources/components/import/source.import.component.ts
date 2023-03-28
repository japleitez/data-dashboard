import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UxAppShellService } from '@eui/core';
import { SourceService } from '../../shared';
import { SourceImportErrorModel } from '../../shared/models/source.import.error.model';
import {
    EuiFileUploadComponent,
    EuiFileUploadUtilsService,
    maxFilesValidator,
    maxSizeValidator,
    mimeTypeExtensionValidator
} from '@eui/components/eui-file-upload';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'Default',
    templateUrl: './source.import.component.html',
})
export class SourceImportComponent implements OnInit {
    public form: FormGroup;
    public progress = 0;
    public rejected = '';
    public isErrorReportVisible = false;
    public errorList: any[] = [];
    public isInvalidFile = false;
    public isUploading = false;

    @ViewChild(EuiFileUploadComponent)
    private euiFileUploadCmp!: EuiFileUploadComponent;

    constructor(
        private fb: FormBuilder,
        private sourceService: SourceService,
        private asService: UxAppShellService,
        private router: Router,
        private location: Location,
        private cd: ChangeDetectorRef,
        private euiFileUploadUtilsService: EuiFileUploadUtilsService,
    ) {
    }

    ngOnInit() {
        this._buildForm();
        this.isUploading = false;
    }

    onCancel(event: any): void {
        this.location.back();
        this.isUploading = false;
    }

    isNotFormValid(): boolean {
        return !this.form.valid;
    }

    isImportDisabled(): boolean {
        const fileLength = this.form.get('fileToUpload').value ? this.form.get('fileToUpload').value.length : 0;
        return !(this.form.valid && !this.isUploading && fileLength > 0);
    }

    onUpload(event: any) {
        if (this.isNotFormValid()) {
            this.asService.growlError('The form is invalid, please select a valid file');
        } else {
            this.resetErrorState();
            this.isUploading = true;
            this.euiFileUploadUtilsService.sendData(this.form.value, this.getBatchImportUrl()).pipe(
                this.euiFileUploadUtilsService.uploadProgress((progress) => { this.reportProgress(progress); }),
                this.euiFileUploadUtilsService.toResponseBody(),
            ).subscribe((response: SourceImportErrorModel) => {
                this.postImport(response);
            }, error => {
                this.handleError(error);
            });
        }
    }

    private _buildForm() {
        this.form = this.fb.group({
            fileToUpload: [null, Validators.compose([
                maxFilesValidator(1),
                maxSizeValidator(15728640),
                mimeTypeExtensionValidator(['application/json'])])],
        });
    }

    private getBatchImportUrl(): string {
        return this.sourceService.getBatchImportUrl();
    }

    private resetErrorState() {
        this.isInvalidFile = false;
        this.isErrorReportVisible = false;
        this.rejected = '';
        this.errorList = [];
    }

    private resetFormState(): void {
        this.progress = 0;
        this.isUploading = false;
        this.form.get('fileToUpload').reset();
        this.euiFileUploadCmp.resetList();
    }

    private reportProgress(progress: number) {
        this.progress = progress;
        this.cd.detectChanges();
    }

    private postImport(response: SourceImportErrorModel) {
        if (!response.sources?.length) {
            this.asService.growlSuccess('All Sources successfully imported');
            this.router.navigate(['/screen/sources']);
        } else {
            this.asService.growlWarning('Some Sources were not imported');
            this.rejected = JSON.stringify(response, null, 4);
            this.errorList = response.sources;
            this.isErrorReportVisible = true;
            this.resetFormState();
        }
    }

    private handleError(error: any): void {
        this.asService.growl({ severity: 'danger', summary: 'ERROR', detail: 'invalid file' });
        this.isInvalidFile = true;
        this.resetFormState();
    }
}
