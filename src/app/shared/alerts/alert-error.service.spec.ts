import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertErrorService } from './alert-error.service';

describe ('Alert Error Service Test', () => {

    let alertErrorSrv: AlertErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AlertErrorService]
        });
        alertErrorSrv = TestBed.inject(AlertErrorService);
    });

    it ('should create AppError when response status is 0', () => {
        const errorResponse = new HttpErrorResponse({
            status: 0,
        });
        alertErrorSrv.handleError(errorResponse).subscribe(fail, error => {
            expect(error.severity).toEqual('danger');
            expect(error.summary).toEqual('Connection refused, server not reachable');
        });

    });

    it ('should create AppError when response status is 404', () => {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        const errorResponse = new HttpErrorResponse({
            status: 404,
            headers: headers
        });
        alertErrorSrv.handleError(errorResponse).subscribe(fail, error => {
            expect(error.severity).toEqual('danger');
            expect(error.summary).toEqual('Not found');
        });

    });

    it ('should create AppError when response status is 422 with detail', () => {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        const errorResponse = new HttpErrorResponse({
            status: 422,
            headers: headers,
            error: { detail: 'expected detail' }
        });
        alertErrorSrv.handleError(errorResponse).subscribe(fail, error => {
            expect(error.severity).toEqual('danger');
            expect(error.summary).toEqual('Cannot process request');
            expect(error.detail).toEqual('expected detail');
        });

    });

    it ('should create AppError when response status is 422 with fieldErrors', () => {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        const errorResponse = new HttpErrorResponse({
            status: 422,
            headers: headers,
            error: {
                fieldErrors: [
                    { field: 'name', message: 'name is required' },
                    { field: 'maxDepth', message: 'maxDepth cannot be negative' }
                ]
            }
        });
        alertErrorSrv.handleError(errorResponse).subscribe(fail, error => {
            expect(error.severity).toEqual('danger');
            expect(error.summary).toEqual('Cannot process request');
            expect(error.detail).toContain('<p>');
            expect(error.detail).toContain('name is required');
            expect(error.detail).toContain('maxDepth cannot be negative');
        });

    });

    it ('should create AppError when response status is 500', () => {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        const errorResponse = new HttpErrorResponse({
            status: 500,
            headers: headers,
            error: { title: 'expected summary', detail: 'expected detail' }
        });
        alertErrorSrv.handleError(errorResponse).subscribe(fail, error => {
            expect(error.severity).toEqual('danger');
            expect(error.summary).toEqual('expected summary');
            expect(error.detail).toEqual('expected detail');
        });

    });

    it ('should create AppError when response status is not handled', () => {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        const errorResponse = new HttpErrorResponse({
            status: 401,
            headers: headers,
            error: { title: 'default' }
        });
        alertErrorSrv.handleError(errorResponse).subscribe(fail, error => {
            expect(error.severity).toEqual('danger');
            expect(error.summary).toEqual('default');
        });

    });

    it ('should create AppError when Header contains error', () => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers = headers.set('app-error', 'x-error').set('app-params', 'x-param');
        const errorResponse = new HttpErrorResponse({
            status: 422,
            headers: headers,
            error: { detail: 'expected detail' }
        });
        alertErrorSrv.handleError(errorResponse).subscribe(fail, error => {
            expect(error.severity).toEqual('danger');
            expect(error.summary).toEqual('x-error x-param');
        });

    });

});
