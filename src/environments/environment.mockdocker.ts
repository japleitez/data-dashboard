import { EuiEnvConfig } from '@eui/core';

export const environment: EuiEnvConfig = {
    production: true,
    enableDevToolRedux: false,
    envDynamicConfig: {
        // this file will be only known by your app, replaced by the app build script once the configEnvTarget is set
        // then picked up by the openid js lib to fetch the openid config related to the target environment used
        uri: 'assets/config/env-json-config-mockdocker.json',
    },
};
