import { GlobalConfig } from '@eui/core';

export const GLOBAL: GlobalConfig = {
    appTitle: 'CSDR-app',
    i18n: {
        i18nService: {
            defaultLanguage: 'en',
            languages: ['en', 'fr'],
        },
        i18nLoader: {
            i18nFolders: ['i18n-eui', 'i18n', 'i18n-ecl'],
        },
    },
    user: {
        defaultUserPreferences: {
            dashboard: { },
            lang: 'en'
        }
    },
    sts: {
        stsServer: 'http://keycloak:9080/auth/realms/jhipster',
        redirectUrl: 'http://host.docker.internal:4200',
        postLogoutRedirectUri: 'http://host.docker.internal:4200',
        clientId: 'web_app',
        scope: 'openid profile email offline_access',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: 1,
        eagerLoadAuthWellKnownEndpoints: false,
    },
};
