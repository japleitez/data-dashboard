import { HttpRequest } from '@angular/common/http';

export const WELL_KNOWN_ENDPOINT = '.well-known/openid-configuration';
export const TOKEN_ENDPOINT = '/token';
export const CERTS_ENDPOINT = '/certs';
export const USER_INFO_ENDPOINT = '/userinfo';

export const AUTH_ENDPOINTS = [WELL_KNOWN_ENDPOINT, TOKEN_ENDPOINT, CERTS_ENDPOINT, USER_INFO_ENDPOINT];

export function isAuthServerEndPoint(url: string): boolean {
    const matches = AUTH_ENDPOINTS.filter(s => url.includes(s));
    return matches.length > 0;
}

export function removeCacheControl(request: HttpRequest<any>): HttpRequest<any> {
    if (request.headers.has('Cache-Control')) {
        return request.clone({ headers: request.headers.delete('Cache-Control', 'no-cache') });
    } else {
        return request;
    }
}
