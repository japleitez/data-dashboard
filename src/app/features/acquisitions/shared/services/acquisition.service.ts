import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CONFIG_TOKEN } from '@eui/core';
import { Acquisition, CreateAcquisition } from '../models/acquisition.model';
import { createRequestOption } from '../../../../shared/request/request-util';
import { Action } from '../models/action.model';
import { AlertErrorService } from '../../../../shared/alerts/alert-error.service';

export type EntityResponseType = HttpResponse<Acquisition>;
export type EntityArrayResponseType = HttpResponse<Acquisition[]>;

@Injectable()
export class AcquisitionService {

    private url;

    constructor(
        @Inject(CONFIG_TOKEN) protected config: any,
        private http: HttpClient,
        private alertErrorService: AlertErrorService
    ) {
        this.url = `${config.modules.acquisitions.api.base}`;
    }

    getAcquisitions(req: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<Acquisition[]>(this.url, { params: options, observe: 'response' })
            .pipe(catchError(this.alertErrorService.handleError));
    }

    getById(id: number): Observable<Acquisition> {
        return this.http.get<Acquisition>(this.url + '/' + id).pipe(catchError(this.alertErrorService.handleError));
    }

    createAcquisition(createAcquisition: CreateAcquisition): Observable<Acquisition> {
        return this.http.post<Acquisition>(this.url, createAcquisition).pipe(catchError(this.alertErrorService.handleError));
    }

    executeAction(id: number, action: string): Observable<Action> {
        return this.http.post<Action>(this.url + '/' + id + '/action/' + action, id).pipe(catchError(this.alertErrorService.handleError));
    }

}
