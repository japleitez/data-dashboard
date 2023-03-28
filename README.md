# eui starter app

## Prerequisites
- Install nvm
- Install node 16.13.2

## Prerequisites for eui/cli
- npm i -g yarn
- npm i -g @eui/cli

## Software setup

1. install nodejs ( LTS Version: 16.15.0 )
2. `npm i -g yarn`
3. `yarn install`
4. `npm i -g @eui/cli`
5. `npm i -g yarn npx @eui/cli`


## Authentication with keycloak
In **c:\Windows\System32\Drivers\etc\hosts** set:
```
127.0.0.1	keycloak
```
From the project folder run:
```
docker compose -f src/main/docker/keycloak.yml up
```

Keycloak has already 2 identity providers. One for local eulogin and one for eulogin host in aws



## 1. Angular Testing

````ng test```` builds the application in watch mode, and launches the Karma test runner

## 2. Development server

````npm start-host-docker```` to start the angular project with local backend service at http://host.docker.internal

````npm start-dev-cognito```` to start the angular project with AuthN using Cognit

````npm start-mock-servce```` to start the angular project with mock json-server

````start-mock-serve-docker```` to start the angular project with mock json-server. The mock json-server will be accessed via http://host.docker.internal . This configuration created for the local karate testing.

````npm start```` to start the angular project with json-server proxy mock server

````npm run start-proxy```` to start the angular project with real backend proxy server deployed

````npm run build```` to build, lint and test your project for DEV

````npm run build-prod```` to build, lint and test your project for PROD

````npm run build-prod-skip-test```` to build and lint your project for PROD - Unit test skipped

````npm run build-prod-stats```` to build, lint and test your project for PROD - with stats.json file generated for webpack-bundle-analyzer input

* check package.json for more info on executable scripts provided



##  3. Linter ( ESLint )  for TS

https://typescript-eslint.io/

The popular linter fot TS - **TSLint** ( https://palantir.github.io/tslint/ ) has been deprecated on 2019.  
Other project **typescript-eslint** ( ESLint ) is recommended for linting TypeScript. (https://typescript-eslint.io/ )

#### 3.1 install ESLint

run this command in terminal  
`npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin`

`@typescript-eslint/eslint-plugin` , `@typescript-eslint/parser`  and `eslint` will be imported into the`package.json`
as devDependencies :

```
    "devDependencies": {
        "@typescript-eslint/eslint-plugin": "^5.9.1",
        "@typescript-eslint/parser": "^5.9.1",
        "eslint": "^8.6.0",
        ...
    },
```
#### 3.2 ESLint configuration

Create configuration file `.eslintrc.json` in the project's root :
```
{
    // project setup
    "env": {
        // this is browser's project.
        "browser": true,
        // this is Node.JS project
//        "node": true,
        // ES6
        "es6": true,
        // ES2015 - the same as in the tsconfig.json ( can be ES2017, etc )
        "es2015": true
    },
    // rules
    "extends": [
        // basic rule set eslint ( https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js )
        "eslint:recommended",
        // switchoff some rules ( https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/eslint-recommended.ts )
        "plugin:@typescript-eslint/eslint-recommended",
        // basic rule set  for TypeScript
        "plugin:@typescript-eslint/recommended",
        //  TS rules, requiring type checking
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    // parser
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        // set project TS for rules with types
        "project": "tsconfig.json",
        "tsconfigRootDir": "."
    },
    // plugin with rules for TypeScript
    "plugins": ["@typescript-eslint"],
    "rules": {
        // manually disabled rules
//        "prefer-const": "off",
//        "no-empty-pattern": "off"
    }
}
```

#### 3.3 ESLint commands in the package.json

run ESLint for whole project : `eslint`  
check ESLint configuration : `eslint-dump`

See commands in the file **package.json**

```
...  
"eslint": "eslint --cache --ext .js,.jsx,.ts,.tsx src",  
"eslint-dump": "eslint --print-config ./.eslintrc.json",  
...
```

#### 3.4 IntelliJ settings  (Ctrl+Alt+S)

Open the Settings/Preferences dialog go to **Languages and Frameworks | JavaScript | Code Quality Tools | ESLint**  
and select **Automatic ESLint** checkbox. Click Apply.


## 4. Further help

- https://eui.ecdevops.eu

- register on [MS Teams](https://teams.microsoft.com/l/team/19%3a2f5bb6b7d1e24c4aabaa62229d3e1955%40thread.tacv2/conversations?groupId=fb6def72-c57b-4e8f-a82e-49be65d6e1f5&tenantId=b24c8b06-522c-46fe-9080-70926f8dddb1) with your EC mail account, for extra-muros please send a mail to DIGIT-EUI-SUPPORT@ec.europa.eu

- For bugs / request new features : Drop us an email at : DIGIT-EUI-SUPPORT@ec.europa.eu

## Europa Component Library (ECL - eUI)

UI Style Guide for developers

- https://eui.ecdevops.eu/eui-showcase-ux-10.x/style-guide
