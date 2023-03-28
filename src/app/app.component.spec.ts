import { TestBed, waitForAsync } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LangChangeEvent } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import {
    UxAppShellService,
    CONFIG_TOKEN,
    I18nService,
} from '@eui/core';
import {
    SharedModule,
} from './shared/shared.module';
import { provideMockStore } from '@ngrx/store/testing';
import { AppRoutingModule } from './app-routing.module';
import { TranslateService } from '@ngx-translate/core';
import { RouterMock } from './shared/testing/router.mock';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppStarterService } from './app-starter.service';
import { CoreModule } from './core/core.module';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';

export class UxAppShellServiceMock {
    state$ = of(null);
}

export class TranslateServiceMock {
    use(lang) {
        if (lang) {
            console.log('use ' + lang);
        }
        return null;
    }
    get onLangChange() { return new EventEmitter<LangChangeEvent>(); }
}

export class I18nServiceMock {
    constructor() {
        // super(null, null, null, null);
    }
    setup() {}
    use() { return of({}); }
    get onLangChange() { return new EventEmitter<LangChangeEvent>(); }
    addResources() { return of({}); }
}

export class AppStarterServiceMock {
    start() {
        return of([true, true]);
    }
}

export class OidcSecurityServiceMock {
    configure() {
    }
    initCodeFlow() {
    }
    setupAutomaticSilentRefresh() {
    }
    getIdentityClaims() {
        return { 'custom:first_name' : 'fake_name', 'custom:last_name' : 'fake_last_name', email: 'fake_email' };
    }
    tryLoginCodeFlow(): Promise<void> {

        return Promise.resolve();
    }
}

export class AuthServiceMock {
    constructor() {
    }
    isAuthorized() { return of(true); }
    navigateToUnauthorizedPage() { }
}

describe('AppComponent Test: ', () => {
    let uxAppShellService: UxAppShellService;
    let translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                SharedModule,
                AppRoutingModule,
                RouterTestingModule,
                HttpClientModule,
                CoreModule
            ],
            providers: [
                provideMockStore({ }),
                { provide: Router, useClass: RouterMock },
                { provide: UxAppShellService, useClass: UxAppShellServiceMock },
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: CONFIG_TOKEN, useValue: { global: { sts: { eagerLoadAuthWellKnownEndpoints: false } }, core: {}, modules: {} } },
                { provide: I18nService, useClass: I18nServiceMock },
                { provide: AppStarterService, useClass: AppStarterServiceMock },
                { provide: OAuthService, useClass: OidcSecurityServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
            ]
        });

        uxAppShellService = TestBed.inject(UxAppShellService);
        translateService = TestBed.inject(TranslateService);
    });

    it('should create the app', waitForAsync(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('should create instance for translateService', waitForAsync(() => {
        expect(translateService).toBeTruthy();
    }));

    it('should create instance for uxAppShellService', waitForAsync(() => {
        expect(uxAppShellService).toBeTruthy();
    }));

    it('should read User Info', waitForAsync(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        app.readUserInfo();
        expect(app.userInfo).not.toBeNull();
    }));

    it('should return Login Name if First Name is undefined', waitForAsync(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        let a, b;
        app.userInfo = app.buildUserInfo(a, b, 'login_NAME', '');
        expect(app.userInfo.name).toEqual('login_NAME');
        expect(app.userInfo.email).toEqual('');
    }));

    it('should return full name if First Name is defined', waitForAsync(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        let a, b;
        a = 'firstName';
        b = 'LastName';
        app.userInfo = app.buildUserInfo(a, b, 'login_NAME', 'email123');
        expect(app.userInfo.name).toEqual('firstName LastName');
        expect(app.userInfo.email).toEqual('email123');
    }));

});
