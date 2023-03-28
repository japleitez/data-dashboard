import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { UxAppShellService } from '@eui/core';
import { markFormGroupTouched } from '@eui/core';
import { Crawler } from '../../shared';
import { CrawlerService } from '../../shared';
import { nameRegexCrawlerNameValidator } from '../../../../shared/validators/name-regex.directive';
import { CopyCrawler } from '../../shared/models/copy-crawler.model';

@Component({
    templateUrl: './crawler.copy.component.html',
})
export class CrawlerCopyComponent implements OnInit {
    form: FormGroup;
    currentCrawler: Crawler;
    copyCrawler: CopyCrawler;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private crawlerService: CrawlerService,
        private asService: UxAppShellService,
        private location: Location
    ) {
    }

    ngOnInit() {
        this._buildForm();
        this._getCrawler();
    }

    onSave(event: any): void {
        markFormGroupTouched(this.form.controls);
        if (!this.form.valid) {
            this.asService.growlError('The form is invalid, please fix the errors');
        } else {
            this.crawlerService.copyCrawler(this.currentCrawler.id, this.form.value).subscribe(
                (crawler: Crawler) => {
                    this.asService.growlSuccess('Crawler successfully copied');
                    this.router.navigate(['/screen/crawlers']);
                },
                error => {
                    this.asService.growlError(<any>error);
                });
        }
    }

    onCancel(event: any): void {
        this.location.back();
    }

    private _buildForm() {
        this.form = this.fb.group({
            'name': [null, Validators.compose([Validators.required, nameRegexCrawlerNameValidator(), Validators.maxLength(100)])]
        });
        this.copyCrawler = this.form.value;
    }

    private _getCrawler() {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.crawlerService.getById(id).subscribe(
                (crawler: Crawler) => {
                    this.currentCrawler = crawler;
                    this.form.patchValue({
                        name: crawler.name + '_copy',
                    });
                },
                error => { this.handleError(error); });
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
