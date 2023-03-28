import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UxAppShellService } from '@eui/core';
import { EuiFileUploadUtilsService,
    EuiFileUploadComponent,
    maxFilesValidator,
    maxSizeValidator,
    mimeTypeExtensionValidator } from '@eui/components/eui-file-upload';
import { CrawlerService } from '../../shared';
import { CrawlerImportResponseModel } from '../../shared/models/crawler.import.response.model';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'Default',
    templateUrl: './crawler.import.component.html',
})
export class CrawlerImportComponent implements OnInit {
    public form: FormGroup;
    public progress = 0;
    public rejected = '';
    public crawlerErrorList: any[] = [];
    public sourcesErrorList: any[] = [];
    public isErrorReportVisible = false;
    public isInvalidFile = false;
    public isUploading = false;

    @ViewChild(EuiFileUploadComponent)
    private euiFileUploadCmp!: EuiFileUploadComponent;

    constructor(
        private fb: FormBuilder,
        private crawlerService: CrawlerService,
        private asService: UxAppShellService,
        private router: Router,
        private location: Location,
        private cd: ChangeDetectorRef,
        private euiFileUploadUtilsService: EuiFileUploadUtilsService,
    ) {}

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
            ).subscribe((response: CrawlerImportResponseModel) => { this.postImport(response); }, error => { this.handleError(error); } );
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
        return this.crawlerService.getBatchImportUrl();
    }

    private resetErrorState() {
        this.isErrorReportVisible = false;
        this.isInvalidFile = false;
        this.rejected = '';
        this.crawlerErrorList = [];
        this.sourcesErrorList = [];
    }
    private resetFormState() {
        this.progress = 0;
        this.isUploading = false;
        this.form.get('fileToUpload').reset();
        this.euiFileUploadCmp.resetList();
    }

    private reportProgress(progress: number) {
        this.progress = progress;
        this.cd.detectChanges();
    }

    private postImport(response: CrawlerImportResponseModel) {
        if (response.crawler) {
            this.asService.growlSuccess('Crawler has been imported');
            this.router.navigate(['/screen/crawlers']);
        } else {
            this.asService.growlWarning('Cannot import file, please see Error Report');
            this.rejected = JSON.stringify(response, null, 4);
            this.crawlerErrorList = response.fieldErrors;
            this.sourcesErrorList = response.sourceErrors;
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
