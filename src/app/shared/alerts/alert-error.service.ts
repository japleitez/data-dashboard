import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
@Injectable()
export class AlertErrorService {

    constructor() {
    }

    handleError(response: HttpErrorResponse): Observable<never> {
        let appError: AppError;
        if (response.status === 0) {
            appError = new AppError('danger', 'Connection refused, server not reachable');
        } else {
            appError = buildAppErrorFromHeader(response.headers);
            if (!appError) {
                appError = buildAppError(response.status, response.error);
            }
        }
        return throwError(appError);
    }
}

export function buildAppErrorFromHeader(headers: any): AppError {
    const arr = headers.keys();
    let errorHeader: string | null = null;
    let entityKey: string | null = null;
    for (const entry of arr) {
        if (entry.toLowerCase().endsWith('app-error')) {
            errorHeader = headers.get(entry);
        } else if (entry.toLowerCase().endsWith('app-params')) {
            entityKey = headers.get(entry);
        }
    }
    if (!errorHeader) {
        return null;
    }
    let alertData = entityKey ? entityKey : undefined;
    let summary = errorHeader + ' ' + alertData;
    return new AppError('danger', summary);
}

/* warning: error structure depends on backend which has variations */
export function buildAppError(status: number, error: any): AppError {
    let summary: string;
    let detail: string;
    switch (status) {
        case 404: {
            summary = 'Not found';
            break;
        }
        case 422: {
            summary = 'Cannot process request';
            if (error.detail) {
                detail = error.detail;
            } else if (error.fieldErrors) {
                detail = '<br>';
                const fieldErrors = error.fieldErrors;
                for (const fieldError of fieldErrors) {
                    detail = '<p>' + detail + fieldError.field + ' ' + fieldError.message + '</p>';
                }
            }
            break;
        }
        case 500: {
            summary = error.title;
            detail = error.detail;
            break;
        }
        default: {
            summary = error.title;
            break;
        }
    }
    return new AppError('danger', summary, detail);
}

export class AppError {
    public isGrowlSticky: boolean = false;
    public isGrowlMultiple: boolean = true;
    public growlLife: number = 3000;
    public position: string = 'bottom-right';
    constructor(public severity: string, public summary: string, public detail?: string) {}
}
