import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CONFIG_TOKEN } from '@eui/core';
import { Source } from '../models/source.model';
import { AlertErrorService } from '../../../../shared/alerts/alert-error.service';
import { createRequestOption } from '../../../../shared/request/request-util';

export type EntityResponseType = HttpResponse<Source>;
export type EntityArrayResponseType = HttpResponse<Source[]>;

@Injectable()
export class SourceService {

    private readonly url;

    constructor(
        @Inject(CONFIG_TOKEN) protected config: any,
        private http: HttpClient,
        private alertErrorService: AlertErrorService
    ) {
        this.url = `${config.modules.sources.api.base}`;
    }

    getSources(req: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<Source[]>(this.url, { params: options, observe: 'response' })
            .pipe(catchError(this.alertErrorService.handleError));
    }

    getSourcesForCrawler(id: number, req: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<Source[]>(this.url, { params: options, observe: 'response' })
            .pipe(catchError(this.alertErrorService.handleError));
    }

    getById(id: number): Observable<Source> {
        return this.http.get<Source>(this.url + '/' + id).pipe(catchError(this.alertErrorService.handleError));
    }

    saveSource(source: Source): Observable<Source> {
        if (source.id) {
            return this.http.put<Source>(this.url + '/' + source.id, source).pipe(catchError(this.alertErrorService.handleError));
        } else {
            return this.http.post<Source>(this.url, source).pipe(catchError(this.alertErrorService.handleError));
        }
    }

    deleteSource(id: number): Observable<Source> {
        return this.http.delete<Source>(this.url + '/' + id).pipe(catchError(this.alertErrorService.handleError));
    }

    getBatchImportUrl(): string {
        return this.url + '/batch/import';
    }

    getBaseUrl(): string {
        return this.url;
    }

}
