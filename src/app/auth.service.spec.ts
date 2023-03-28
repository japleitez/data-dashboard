import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
    LoginOptions,
    OAuthEvent,
    OAuthService,
    OAuthSuccessEvent,
    ParsedIdToken,
    TokenResponse,
    UserInfo
} from 'angular-oauth2-oidc';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Subject } from 'rxjs';
import {
    CONFIG_TOKEN,
} from '@eui/core';

export class MockOAuthService implements Partial<OAuthService> {

    private _events = new Subject<OAuthEvent>();
    events: Observable<OAuthEvent> = this._events.asObservable();
    state?: string;

    private _isTokenValid = true;
    private _isValidIdToken = true;
    private _accessToken = '';

    public _claims: Record<string, unknown>;

    getIdentityClaims(): Record<string, unknown> {
        return this._claims;
    }

    hasValidAccessToken(): boolean {
        return this._isTokenValid;
    }

    hasValidIdToken(): boolean {
        return this._isValidIdToken;
    }

    getAccessToken(): string {
        return this._accessToken;
    }

    emulateEvent(event: OAuthEvent) {
        this._events.next(event);
    }

}

describe('AuthService', () => {
    let service: AuthService;
    let mockService: MockOAuthService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                AuthService,
                { provide: OAuthService, useClass: MockOAuthService },
                { provide: CONFIG_TOKEN, useValue: { global: { member: 'WIHP' }, core: {}, modules: {} } },
            ]
        });

        service = TestBed.inject(AuthService);
        mockService = TestBed.inject(OAuthService) as any as MockOAuthService;
        router = TestBed.inject(Router);

    });

    it('should return true when user is authorized', waitForAsync (() => {
        mockService._claims = { 'cognito:groups' : ['eu-central-1_ul2IGtNhv_EULogin', 'WIHP'] };
        service.isAuthorized().subscribe( result => expect(result).toBeTrue());
    }));

    it('should return false when user is not authorize', waitForAsync (() => {
        mockService._claims = { 'cognito:groups' : ['eu-central-1_ul2IGtNhv_EULogin', 'OTHER'] };
        service.isAuthorized().subscribe( result => expect(result).toBeFalse());
    }));

});
