const jsonServer = require('json-server');
const app = jsonServer.create();
const router = require('./lowdb').getRouter();
const middlewares = jsonServer.defaults();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sources = require('./core/sources');
const crawlers = require('./core/crawlers');
const configs = require('./core/configs');
const sourceImportFaker = require("./core/sourceImportFaker");
const crawlerImportFaker = require("./core/crawlerImportFaker");
const urlFilters = require('./core/urlFilters');
const urlFilerTestResponse = require('./core/urlFilerTestResponse');
const parseFilerTestResponse = require('./core/parseFilerTestResponse');
const navigationFilters = require('./core/navigationFilters');
const navigationFiltersTestResponse = require('./core/navigationFilterTestResponse');
// const delayMiddleware = require('./middlewares/delay');
// const errorsMiddleware = require('./middlewares/errors');
// const sseMiddleware = require('./middlewares/sse');

// Set the port of our application
const port = process.env.PORT || 3000;

// Middlewares
app.use(middlewares);
// app.use(delayMiddleware.delay);
// app.use(errorsMiddleware.error);
// app.use(sseMiddleware.sse);

// To handle POST, PUT and PATCH we need to use any body-parser
// We using the one bundled with json-server
app.use(jsonServer.bodyParser);

// support for the multiform upload file
// file will be stored in the folder .\data-acquisition-dashboard\mock\json\uploadFiles
// this folder will be created
let uploadedFileName = '=== undefined ==';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'uploadFiles');
        if (!fs.existsSync(dir)){
            console.log('created folder for the upload files: ', dir);
            fs.mkdirSync(dir);
        }
        cb(null, path.join(__dirname, 'uploadFiles'));
    },
    filename: function (req, file, cb) {
        uploadedFileName = file.originalname;
        cb(null, file.originalname + '-' + Date.now());
    }
})
app.use(multer({ storage }).any());


// Controllers


// Simulate endpoints that fail with 500, 400, 404, 401
app.get('/api/getError500', (req, res, next) => {
    res.sendStatus(500)
});
app.get('/api/customErrorHandlerOn400', (req, res, next) => {
    res.sendStatus(400)
});
app.get('/api/this-doesnt-exist', (req, res, next) => {
    res.sendStatus(404)
});
app.get('/api/admin/*', (req, res, next) => {
    res.sendStatus(401)
});

app.post('/api/sources', (req, res, next) => {
    if (typeof(req.body.name) == 'undefined' || req.body.name == null || req.body.name === '') {
        res.sendStatus(422);
    } else if (req.body.name.length > 100) {
        res.sendStatus(422);
    } else if (req.body.name === '$eurostat') {
        res.sendStatus(422);
    } else if (typeof(req.body.url) == 'undefined' || req.body.url == null || req.body.url === '') {
        res.sendStatus(422);
    } else {
        res.jsonp({});
        res.sendStatus(201);
    }
});

app.put('/api/sources/:id', (req, res, next) => {

    if (typeof(req.body.name) == 'undefined' || req.body.name == null || req.body.name === '') {
        res.sendStatus(422);
    } else if (req.body.name === '$eurostat') {
        res.sendStatus(422);
    } else if (typeof(req.body.url) == 'undefined' || req.body.url == null || req.body.url === '') {
        res.sendStatus(422);
    } else if (req.body.url === '*$invalid') {
        res.sendStatus(422);
    } else {
        res.sendStatus(200);
    }
});

//app.post('/api/sources/batch/import', (req, res, next) => {
app.post('/sources/batch/import', (req, res, next) => {
    console.log('uploadedFileName   ', uploadedFileName);

    if (uploadedFileName.includes('422.json')) {
        res.sendStatus(422);
    } else if (uploadedFileName.includes('202.json')) {
        res.status(202);
        res.json(sourceImportFaker.getSourcesImportError());
    } else {
        res.json({});
    }
});

app.post('/crawlers/import', (req, res, next) => {
    console.log('uploadedFileName: ', uploadedFileName);

    if (uploadedFileName.includes('422.json')) {
        res.sendStatus(422);
    } else if (uploadedFileName.includes('202.json')) {
        res.status(202);
        res.json(crawlerImportFaker.getCrawlerImportError());
    } else {
        res.json({ crawler: '/api/crawlers/1' });
    }
});

app.post('/api/crawlers', (req, res, next) => {
    if (typeof(req.body.fetchInterval) == 'undefined') {
        res.sendStatus(400);
    } else if (req.body.emitOutlinks == null) {
        res.sendStatus(422);
    } else if (req.body.filters[0].className === '$invalid') {
        res.sendStatus(422);
    } else if (req.body.filters[0].name === '$invalid') {
        res.sendStatus(422);
    } else if (req.body.filters[0].params === '$invalid') {
        res.sendStatus(422);    }
    else {
        res.sendStatus(201);
    }
});

app.get('/api/crawlers/:id/sources', (req, res) => {
    let crawler_id = req.params.id;
    let crawler_item = crawlers.getCrawlers().filter(item => item.id === crawler_id);
    if(crawler_item.length === 0 ){
        res.sendStatus(500);
    }
    res.json(crawler_item[0].sources);
});

app.post('/crawlers/:id/sources/:sid', (req, res) => {
    let crawler_id = req.params.id;
    let source_id = req.params.sid;
    let sourceExist = false;
    let crawler_item = crawlers.getCrawlers().filter(item => item.id === crawler_id);

    crawler_item[0].sources.forEach((item) => {
        if(item.id === source_id){
            sourceExist = true;
        }
    });
    if(sourceExist){
        res.sendStatus(409);
    } else {
        res.status(200);
        res.json(crawler_item);
    }
});

app.get('/api/crawlers', (req, res) => {
    if (req.query.page === 'undefined' || req.query.page == null) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/crawlers?page=1&size=25>; rel="next"');
        res.json(crawlers.getCrawlersData(25));
    } else if (req.query.page === 1) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/crawlers?page=0&size=25>; rel="previous"');
        res.json(crawlers.getCrawlersData(5));
    } else if (req.query.size === 50) {
        res.status(200);
        res.json(crawlers.getCrawlersData(30));
    } else if (req.query.page > 9) {
        res.sendStatus(400);
    } else {
        res.sendStatus(500);
    }
});

app.put('/api/crawlers/:id', (req, res, next) => {
    if (req.body.emitOutlinks == null) {
        res.sendStatus(422);
    } else if (req.body.filters[0].className === '$invalid') {
        res.sendStatus(422);
    } else if (req.body.filters[0].name === '$invalid') {
        res.sendStatus(422);
    } else if (req.body.filters[0].params === '$invalid') {
        res.sendStatus(422);
    } else {
        res.sendStatus(200);
    }
});

app.post('/api/acquisitions', (req, res, next) => {
    if (req.body.name === 'crawler name $') {
        res.sendStatus(422);
    } else if (req.body.uuid === 'workflow_uuid') {
        res.sendStatus(422);
    } else if (typeof(req.body.name) == 'undefined' && typeof(req.body.uuid) == 'undefined') {
        res.sendStatus(400);
    } else {
        res.sendStatus(201);
    }
});

app.post('/api/crawlers/:id/copy', (req, res, next) => {
    if (typeof(req.body.name) == 'undefined' || req.body.name == null || req.body.name === '') {
        res.sendStatus(422);
    } else if (req.body.name.length > 100) {
        res.sendStatus(422);
    } else if (req.body.name === '$eurostat') {
        res.sendStatus(422);
    } else if (req.body.name === 'duplicate') {
        res.status(422);
        res.setHeader('X-HTTP-Error-Description', 'The name is already in use');
        res.json('{"error":"The name is already in use"}');
    } else {
        res.sendStatus(201);
    }
});

app.get('/api/url-filters', (req, res) => {
    if (req.query.page === 'undefined' || req.query.page == null) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/url-filters?page=1&size=25>; rel="next"');
        res.json(urlFilters.getUrlFiltersData(25));
    } else if (req.query.page === 1) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/url-filters?page=0&size=25>; rel="previous"');
        res.json(urlFilters.getUrlFiltersData(5));
    } else if (req.query.size === 50) {
        res.status(200);
        res.json(urlFilters.getUrlFiltersData(30));
    } else if (req.query.page > 9) {
        res.sendStatus(400);
    } else {
        res.sendStatus(500);
    }
});

app.get('/api/parse-filters', (req, res) => {
    if (req.query.page === 'undefined' || req.query.page == null) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/parse-filters?page=1&size=25>; rel="next"');
        res.json(urlFilters.getParseFiltersData(25));
    } else if (req.query.page === 1) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/parse-filters?page=0&size=25>; rel="previous"');
        res.json(urlFilters.getParseFiltersData(5));
    } else if (req.query.size === 50) {
        res.status(200);
        res.json(urlFilters.getParseFiltersData(30));
    } else if (req.query.page > 9) {
        res.sendStatus(400);
    } else {
        res.sendStatus(500);
    }
});

app.get('/api/navigation-filters', (req, res) => {
    if (req.query.page === 'undefined' || req.query.page == null) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/navigation-filters?page=1&size=25>; rel="next"');
        res.json(navigationFilters.getNavigationFiltersData(25));
    } else if (req.query.page === 1) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/navigation-filters?page=0&size=25>; rel="previous"');
        res.json(navigationFilters.getNavigationFiltersData(5));
    } else if (req.query.size === 50) {
        res.status(200);
        res.json(navigationFilters.getNavigationFiltersData(30));
    } else if (req.query.page > 9) {
        res.sendStatus(400);
    } else {
        res.sendStatus(500);
    }
});


app.post('/url-filters/:id', (req, res, next) => {
    res.json(urlFilerTestResponse.getFilterUrlTestResponse(req.params.id));
});

app.post('/parse-filters/:id', (req, res, next) => {
    res.json(parseFilerTestResponse.getFilterParseTestResponse(req.params.id));
});

app.post('/navigation-filters/:id', (req, res, next) => {
    res.json(navigationFiltersTestResponse.getFilterNavigationTestResponse(req.params.id));
});


app.get('/api/sources', (req, res) => {
    if (req.query.page === 'undefined' || req.query.page == null) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/sources?page=1&size=25>; rel="next"');
        res.json(sources.getSourcesData(25));
    } else if (req.query.page === 1) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/sources?page=0&size=25>; rel="previous"');
        res.json(sources.getSourcesData(5));
    } else if (req.query.size === 50) {
        res.status(200);
        res.json(sources.getSourcesData(30));
    } else if (req.query.page > 9) {
        res.sendStatus(400);
    } else {
        res.sendStatus(500);
    }
});

app.get('/api/crawlers/:id/sources', (req, res) => {
    res.status(200);
    res.setHeader('Link', '<http://localhost:8081/api/crawlers/1/sources?page=1&size=25>; rel="next"');
    res.json(sources.getSourcesData(28));
});

app.get('/api/configs', (req, res) => {
    if (req.query.page === 'undefined' || req.query.page == null) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/configs?page=1&size=25>; rel="next"');
        res.json(configs.getConfigsData(25));
    } else if (req.query.page === 1) {
        res.status(200);
        res.setHeader('Link', '<http://localhost:8081/api/sources?page=0&size=25>; rel="previous"');
        res.json(configs.getConfigsData(5));
    } else if (req.query.size === 50) {
        res.status(200);
        res.json(configs.getConfigsData(30));
    } else if (req.query.page > 9) {
        res.sendStatus(400);
    } else {
        res.sendStatus(500);
    }
});

app.post('/api/logging', (req, res, next) => {
    let filePath = __dirname + '/logs.txt';

    fs.appendFile(filePath, `${JSON.stringify(req.body)}\n\n`, function() {
        res.sendStatus(200);
    });
});

app.post('/api/translate', (req, res, next) => {
    res.send(req.body.data);
});

// endpoint to test ApiQueueService
app.post('/api/form', (req,res,next) => {
    // respond with delay so that user can block the request or close the Tab
    setTimeout(()=>res.send(req.body.data), 4000)
});

// Rewriter rules
app.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/user/preferences?userId:userId&lang=:lang': '/user-preferences',
    '/api/configuration': 'configuration',
    '/api/people': 'people'
}));

// Mount the router based on lowdb.js
app.use(router);

// Start listening
app.listen(port, () => {
    console.log(`\n\nJSON Server is running! Open the browser at http://localhost:${port}\n\n`);
});

