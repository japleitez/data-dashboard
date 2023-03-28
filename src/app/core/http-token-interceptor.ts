import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { isAuthServerEndPoint, removeCacheControl } from './auth.globals';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
    providedIn: 'root'
})
export class HttpTokenInterceptor implements HttpInterceptor {

    constructor(private oAuthService: OAuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isAuthServerEndPoint(request.url)) {
            request = removeCacheControl(request);
        } else {
            if (this.oAuthService.hasValidIdToken() || this.oAuthService.hasValidAccessToken()) {
                request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${this.oAuthService.getAccessToken()}`) });
            } else {
                this.oAuthService.initCodeFlow();
            }
        }
        return next.handle(request);
    }
}
