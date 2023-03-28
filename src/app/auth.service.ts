/* eslint-disable brace-style */
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
    CONFIG_TOKEN,
    EuiAppConfig,
} from '@eui/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

    public isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

    constructor(
        private oauthService: OAuthService,
        private router: Router,
        @Inject(CONFIG_TOKEN) private config: EuiAppConfig,
    ) {
        this.oauthService.events
            .subscribe(_ => {
                this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
            });
    }

    public isAuthorized(): Observable<boolean> {
        let result = false;
        if (this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken()) {
            const member = this.config.global.member;
            result = this.isValidGroupMember(this.oauthService.getIdentityClaims(), member);
        }
        return of(result);
    }

    public isValidGroupMember(claims, member): boolean {
        if (claims == null || member == null) {
            return false;
        }
        let result = false;
        if ('cognito:groups' in claims) {
            let groups = claims['cognito:groups'];
            for (let i = 0, lth = groups.length; i < lth; i++) {
                if (member === groups[i]) {
                    result = true;
                    break;
                }
            }
        } else if ('aud' in claims) {
            if (member === claims.aud) {
                result = true;
            }
        }
        return result;
    }

    public navigateToUnauthorizedPage() {
        this.router.navigateByUrl('screen/unauthorized');
    }

}
