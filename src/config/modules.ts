import { ModulesConfig } from '@eui/core';

export const MODULES: ModulesConfig = {
    core: {
        base: '/api',
        userDetails: '/user-details',
        userPreferences: '/user-preferences'
    },
    sources: {
        api: {
            base: 'http://host.docker.internal:8081/api/sources'
        }
    },
    acquisitions: {
        api: {
            base: 'http://host.docker.internal:8081/api/acquisitions'
        }
    },
    crawlers: {
        api: {
            base: 'http://host.docker.internal:8081/api/crawlers'
        }
    },
    playground: {
        api: {
            base: 'http://host.docker.internal:8082/api/'
        }
    }
};
