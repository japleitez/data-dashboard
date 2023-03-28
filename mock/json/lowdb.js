const jsonServer = require('json-server');

const userDetails = require('./core/user').generateUserDetails();
const userPreferences = require('./core/user').generateUserPreferences();
const configDetails = require('./core/config').getConfiguration();
const crawlersDetails = require('./core/crawlers').getCrawlers();
const sourcesDetails = require('./core/sources').getSources();
const buildings = require('./core/buildings').getBuildings();
const acquisitions = require('./core/acquisitions').getAcquisitions();
const configs = require('./core/configs').getConfigs();
const urlFiltersDetails =  require('./core/urlFilters').getUrlFilters();
const parseFiltersDetails =  require('./core/parseFilters').getParseFilters();
const navigationFilterDetails =  require('./core/navigationFilters').getNavigationFilters();

const generateMocks = () => {
    return Object.assign({
        'user-details': userDetails,
        'user-preferences': userPreferences,
        'configuration': configDetails,
        'sources': sourcesDetails,
        'crawlers': crawlersDetails,
        'buildings': buildings,
        'acquisitions': acquisitions,
        'url-filters': urlFiltersDetails,
        'parse-filters': parseFiltersDetails,
        'navigation-filters': navigationFilterDetails,
        'configs': configs
    });
};

// set mocks-obj to the router
const mocks = generateMocks();
const router = jsonServer.router(mocks);

// expose router and db behind json-server
// (@{link https://github.com/typicode/lowdb})
exports.getDb = () => {
    return router.db;
};

exports.getRouter = () => {
    return router;
};
