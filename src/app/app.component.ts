import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
    CONFIG_TOKEN,
    EuiAppConfig,
    I18nService,
    UserService,
    UxLanguage,
    UxLink,
    getUserState,
    UserState,
} from '@eui/core';
import { Observable, of, Subscription } from 'rxjs';
import { AppStarterService } from './app-starter.service';
import { UserInfo } from './shared/auth/user.info.model';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
    isAuthenticated$: Observable<boolean>;
    userInfo: UserInfo = { name: null, email: null };
    userInfos: UserState;
    // Observe state changes
    userState: Observable<UserState>;
    // an array to keep all subscriptions and easily unsubscribe
    menuLinks: UxLink[] = [];
    subs: Subscription[] = [];

    sidebarItems = [
        new UxLink({ label: 'Home', url: 'screen/home', iconClass: 'eui-icon-home' }),
        new UxLink({ label: 'Sources', url: 'screen/sources', iconClass: 'eui-icon-work' }),
        new UxLink({ label: 'Crawlers', url: 'screen/crawlers', iconClass: 'eui-icon-work' }),
        new UxLink({ label: 'Acquisitions', url: 'screen/acquisitions', iconClass: 'eui-icon-work' }),
        new UxLink({ label: 'Playground', url: 'screen/playground', iconClass: 'eui-icon-work' }),
    ];
    notificationItems: UxLink[] = [];

    showProfileDrawer = false;
    environment;

    constructor(
        private translateService: TranslateService,
        private store: Store<any>,
        @Inject(CONFIG_TOKEN) private config: EuiAppConfig,
        private i18nService: I18nService,
        private userService: UserService,
        private appStarterService: AppStarterService,
        private oauthService: OAuthService,
        private authService: AuthService,
    ) {
        this.environment = config.global.environment;
        if (config.global.stsEnabled) {
            this.oauthService.configure(config.global.sts);
            this.oauthService.tryLoginCodeFlow().then(() => {
                let claims = this.oauthService.getIdentityClaims();
                if (claims) {
                    this.readUserInfo();
                    this.postAuthentication();
                } else {
                    this.oauthService.initCodeFlow();
                }
            });
            this.oauthService.setupAutomaticSilentRefresh();
            this.isAuthenticated$ = this.authService.isAuthenticated$;
        } else {
            this.isAuthenticated$ = of(true);
            this.userInfo = { name: 'Mr Developer', email: 'developer@developer.dev' };
            this.postAuthentication();
        }
    }

    readUserInfo() {
        let claims = this.oauthService.getIdentityClaims();
        if (claims) {
            this.userInfo = this.buildUserInfo(claims['custom:first_name'],
                claims['custom:last_name'], claims['custom:user'], claims['email']);
        }
    }

    buildUserInfo(firstName: string, lastName: string, login: string, email: string) {
        return (firstName) ? { name: firstName + ' ' + lastName, email: email } : { name: login, email: '' };
    }

    postAuthentication() {
        this.appStarterService.start().subscribe(([i18nStatus, permissionStatus]) => {
            // if (i18nStatus && i18nStatus.success) {
            //     this.appStarterService.observeLanguageChangesAndUpdateUserPreferences();
            //     this.appStarterService.observeUserPrefChangesAndSavePreferences();
            // }
            this._createNotifications();
            this._createMenuLinks();

            // set userState Observable and subscribe to change userInfos upon updates
            this.userState = <any>this.store.select(getUserState);
            this.subs.push(this.userState.subscribe((user: UserState) => {
                    this.userInfos = user;
                }
            ));
        });

        // subscribe for language changes and update menu links
        this.subs.push(this.translateService.onLangChange
            .subscribe((event: LangChangeEvent) => {
                // update menu labels based on selected translation
                this._createMenuLinks();
            }));
    }

    logout() {
        this.oauthService.logOut();
    }

    ngOnInit() {
        this._createMenuLinks();
        this._createNotifications();
    }

    ngOnDestroy() {
        this.subs.forEach((s: Subscription) => s.unsubscribe());
    }

    onLanguageChanged(language: UxLanguage) {
        this.translateService.use(language.code);
    }

    onSidebarProfileToggle(event: any) {
        this.showProfileDrawer = !this.showProfileDrawer;
    }

    private _createMenuLinks() {
        this.menuLinks = [
            ...this.sidebarItems,

        ];
    }

    private _createNotifications() {
        this.notificationItems = [
            ...this.notificationItems,
        ];
    }
}
