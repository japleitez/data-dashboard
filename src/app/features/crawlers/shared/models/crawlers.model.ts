import { Source } from '../../../sources/shared';
import { Filter } from './filters.model';

export interface Crawler {
    id: number;
    name: string;
    sources: Source[];
    fetchInterval: number;
    fetchIntervalWhenError: number;
    fetchIntervalWhenFetchError: number;
    extractorNoText: boolean;
    extractorTextIncludePattern: String;
    extractorTextExcludeTags: String;
    httpContentLimit: number;
    emitOutLinks: boolean;
    dynamic: boolean;
    dynamicConfig: {
        maximized: boolean;
        language: string;
        windowSize: string;
        loadImages: string;
        allowCookies: string;
        allowGeolocation: string;
    };
    maxEmitOutLinksPerPage: number;
    parserFilters: Filter[];
    urlFilters?: any [];
    parseFilters?: any [];
    navigationFilters?: any [];
}

export function createTestCrawlerList(size: number): Crawler[] {
    const crawlers = [];
    for (let i = 1; i < size + 1; i++) {
        crawlers.push(createTestCrawler(i, 'crawler' + i));
    }
    return crawlers;
}

export function createTestCrawler(id: number, name: string): Crawler {
    const crawler: Crawler = {
        'id': id,
        'name': name,
        'sources': [{ 'id': 1, 'name': 'source', 'url': 'https://source.com' },
            { 'id': 2, 'name': 'source2', 'url': 'https://source2.com' }],
        'fetchInterval': 1440,
        'fetchIntervalWhenError': 44640,
        'fetchIntervalWhenFetchError': 120,
        'extractorNoText': false,
        'extractorTextIncludePattern': '- DIV[id=\'maincontent\']\r\n- DIV[itemprop=\'articleBody\']\r\n- ARTICLE',
        'extractorTextExcludeTags': '- STYLE\r\n- SCRIPT',
        'httpContentLimit': 15000000,
        'emitOutLinks': false,
        'dynamic': false,
        'dynamicConfig': {
            'maximized': true,
            'language': 'en',
            'windowSize': '1920,1080',
            'loadImages': 'ALLOW',
            'allowCookies': 'BLOCK',
            'allowGeolocation': 'BLOCK'
        },
        'maxEmitOutLinksPerPage': -1,
        'parserFilters': [
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.parse.filter.XPathFilter',
                'name': 'XPathFilter',
                'params': {
                    'canonical': '//*[@rel="canonical"]/@href',
                    'parse.description': [
                        '//*[@name="description"]/@content',
                        '//*[@name="Description"]/@content'
                    ],
                    'parse.title': [
                        '//TITLE',
                        '//META[@name="title"]/@content'
                    ],
                    'parse.keywords': '//META[@name="keywords"]/@content'
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.basic.BasicURLFilter',
                'name': 'BasicURLFilter',
                'params': {
                    'maxPathRepetition': 3,
                    'maxLength': 1024
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.depth.MaxDepthFilter',
                'name': 'MaxDepthFilter',
                'params': {
                    'maxDepth': -1
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.basic.BasicURLNormalizer',
                'name': 'BasicURLNormalizer',
                'params': {
                    'removeAnchorPart': false,
                    'unmangleQueryString': true,
                    'checkValidURI': true
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.host.HostURLFilter',
                'name': 'HostURLFilter',
                'params': {
                    'ignoreOutsideHost': false,
                    'ignoreOutsideDomain': true
                }
            },
            {
                'id': null,
                'class_name': 'com.digitalpebble.stormcrawler.filtering.regex.RegexURLFilter',
                'name': 'RegexURLFilter',
                'params': {
                    'urlFilters': ['# +.']
                }
            },
            {
                'id': null,
                'class_name': 'eu.europa.ec.eurostat.wihp.filters.url.EsFastUrlFilter',
                'name': 'FastURLFilter',
                'params': [
                    {
                        'scope': 'GLOBAL',
                        'patterns': [
                            'DenyPathQuery \\.jpg'
                        ]
                    },
                    {
                        'scope': 'domain:stormcrawler.net',
                        'patterns': [
                            'AllowPath /digitalpebble/',
                            'DenyPath .+'
                        ]
                    },
                    {
                        'scope': 'metadata:key=value',
                        'patterns': [
                            'DenyPath .+'
                        ]
                    }
                ]
            }
        ]
    };
    return crawler;
}
