import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { isAuthServerEndPoint, removeCacheControl, WELL_KNOWN_ENDPOINT } from './auth.globals';

@Injectable({
    providedIn: 'root'
})
export class HttpCacheInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isAuthServerEndPoint(request.url)) {
            request = removeCacheControl(request);
        } else {
            request = request.clone({ headers: request.headers.set('Cache-Control', 'no-cache') });
        }
        return next.handle(request);
    }
}
