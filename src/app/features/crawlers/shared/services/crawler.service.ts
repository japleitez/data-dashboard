import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CONFIG_TOKEN } from '@eui/core';
import { Crawler } from '../models/crawlers.model';

import { createRequestOption } from '../../../../shared/request/request-util';
import { AlertErrorService } from '../../../../shared/alerts/alert-error.service';
import { CopyCrawler } from '../models/copy-crawler.model';
import { Source } from '../../../sources/shared';

export type EntityResponseType = HttpResponse<Crawler>;
export type EntityArrayResponseType = HttpResponse<Crawler[]>;
export type SourceArrayResponseType = HttpResponse<Source[]>;
export type EntityArrayResponseTypeSource = HttpResponse<Source[]>;

@Injectable()
export class CrawlerService {

    private url;

    constructor(
        @Inject(CONFIG_TOKEN) protected config: any,
        private http: HttpClient,
        private alertErrorService: AlertErrorService
    ) {
        this.url = `${config.modules.crawlers.api.base}`;
    }

    getCrawlers(req: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<Crawler[]>(this.url, { params: options, observe: 'response' })
            .pipe(catchError(this.alertErrorService.handleError));
    }

    getById(id: number): Observable<Crawler> {
        return this.http.get<Crawler>(this.url + '/' + id).pipe(catchError(this.alertErrorService.handleError));
    }

    saveCrawler(crawler: Crawler): Observable<Crawler> {
        if (crawler.id) {
            return this.http.put<Crawler>(this.url + '/' + crawler.id, crawler).pipe(catchError(this.alertErrorService.handleError));
        } else {
            crawler.parserFilters = [];
            return this.http.post<Crawler>(this.url, crawler).pipe(catchError(this.alertErrorService.handleError));
        }
    }

    deleteCrawler(id: number): Observable<Crawler> {
        return this.http.delete<Crawler>(this.url + '/' + id).pipe(catchError(this.alertErrorService.handleError));
    }

    copyCrawler(id: number, copyCrawler: CopyCrawler): Observable<Crawler> {
        return this.http.post<Crawler>(this.url + '/' + id + '/copy', copyCrawler).pipe(catchError(this.alertErrorService.handleError));
    }

    getSourcesForCrawler(crawlerId: number, req: any): Observable<EntityArrayResponseTypeSource> {
        const options = createRequestOption(req);
        // return this.http.get<Source[]>('http://localhost:3000/api/crawlers' + '/' + crawlerId + '/sources',
        //     { params: options, observe: 'response' })
        return this.http.get<Source[]>(this.url + '/' + crawlerId + '/sources', { params: options, observe: 'response' })
            .pipe(catchError(this.alertErrorService.handleError));
    }

    saveSourcesForCrawler(crawlerId: number, sourceId: number) {
        return this.http.post(this.url + '/' + crawlerId + '/sources/' + sourceId, null)
            .pipe(catchError(this.alertErrorService.handleError));
    }

    deleteSourcesForCrawler(crawlerId: number, sourceId: number): Observable<Crawler> {
        return this.http.delete<Crawler>(this.url + '/' + crawlerId + '/sources/' + sourceId)
            .pipe(catchError(this.alertErrorService.handleError));
    }

    getBatchImportUrl(): string {
        return this.url + '/import';
    }
}
