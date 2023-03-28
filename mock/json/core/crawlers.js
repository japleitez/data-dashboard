const faker = require('faker');

buildSources = (sourcesNumber) => {
    let sources = [];
    for (let index = 1; index < sourcesNumber + 1; index++) {
        sources.push({
                id: index,
                name: 'source' + index,
                url: 'http://source' + index
            }
        );
    }
    return sources;
};


const generateCrawlersData = (number) => {
    const crawlers = [];
    let max = number + 1;

    for (let i = 1; i < max; i++) {
        crawlers.push({
            "id": i,
            "name": "crawler demo " + i,
            "sources": buildSources(i),
            "fetchInterval": faker.datatype.number({min: -1, max: 1440}),
            "fetchIntervalWhenError": faker.datatype.number({min: -1, max: 44640}),
            "fetchIntervalWhenFetchError": faker.datatype.number({min: -1, max: 1440}),
            "extractorNoText": faker.datatype.boolean(),
            "extractorTextIncludePattern": "this is a long custom pattern",
            "extractorTextExcludeTags": "THOSE;ARE;TAGS",
            "httpContentLimit": faker.datatype.number({min: -1, max: 1440}),
            "emitOutLinks": faker.datatype.boolean(),
            "dynamic": false,
            "maxEmitOutLinksPerPage": -1,
            "filters": [
                {
                    "className": "com.digitalpebble.stormcrawler.parse.filter.ParserFilter",
                    "name": "XPathFilter",
                    "params": {
                        "canonical": "//*[@rel=\"canonical\"]/@href",
                        "parse.description": [
                            "//*[@name=\"description\"]/@content",
                            "//*[@name=\"Description\"]/@content"
                        ],
                        "parse.title": [
                            "//TITLE",
                            "//META[@name=\"title\"]/@content"
                        ],
                        "parse.keywords": "//META[@name=\"keywords\"]/@content"
                    }
                },
                {
                    "className": "com.digitalpebble.stormcrawler.filtering.basic.BasicURLFilter",
                    "name": "BasicURLFilter",
                    "params": {
                        "maxPathRepetition": 3,
                        "maxLength": 1024
                    }
                },
                {
                    "className": "com.digitalpebble.stormcrawler.filtering.depth.MaxDepthFilter",
                    "name": "MaxDepthFilter",
                    "params": {
                        "maxDepth": -1
                    }
                },
                {
                    "className": "com.digitalpebble.stormcrawler.filtering.basic.BasicURLNormalizer",
                    "name": "BasicURLNormalizer",
                    "params": {
                        "removeAnchorPart": faker.datatype.boolean(),
                        "unmangleQueryString": faker.datatype.boolean(),
                        "checkValidURI": faker.datatype.boolean()
                    }
                },
                {
                    "className": "com.digitalpebble.stormcrawler.filtering.host.HostURLFilter",
                    "name": "HostURLFilter",
                    "params": {
                        "ignoreOutsideHost": faker.datatype.boolean(),
                        "ignoreOutsideDomain": faker.datatype.boolean()
                    }
                },
                {
                    "className": "com.digitalpebble.stormcrawler.filtering.regex.RegexURLFilter",
                    "name": "RegexURLFilter",
                    "params": {
                        "regexFilter": ""
                    }
                },
                {
                    "className": "com.digitalpebble.stormcrawler.filtering.regex.FastURLFilter",
                    "name": "FastURLFilter",
                    "params": [
                        {
                            "scope": "GLOBAL",
                            "patterns": [
                                "DenyPathQuery \\.jpg"
                            ]
                        },
                        {
                            "scope": "domain:stormcrawler.net",
                            "patterns": [
                                "AllowPath /digitalpebble/",
                                "DenyPath .+"
                            ]
                        },
                        {
                            "scope": "metadata:key=value",
                            "patterns": [
                                "DenyPath .+"
                            ]
                        }
                    ]
                }
            ],
            "dynamicConfig": {
                "maximized": true,
                "language": "en-GB",
                "windowSize": "1920,1080",
                "loadImages": "ALLOW",
                "allowCookies": "BLOCK",
                "allowGeolocation": "BLOCK"
            }
        })
    };
    // push extra crawler with "test filters"
    crawlers.push({
        "id": number + 1,
        "name": "with_filters_1",
        "fetchInterval": 771,
        "fetchIntervalWhenError": 4419,
        "fetchIntervalWhenFetchError": 574,
        "extractorNoText": false,
        "extractorTextIncludePattern": "this is a long custom pattern",
        "extractorTextExcludeTags": "THOSE;ARE;TAGS",
        "httpContentLimit": 227,
        "emitOutLinks": true,
        "dynamic": true,
        "dynamicConfig": {
        "language": "ru-JP",
            "maximized": true,
            "windowSize": "1111,1111",
            "loadImages": "BLOCK",
            "allowCookies": "BLOCK",
            "allowGeolocation": "BLOCK"
    },
        "maxEmitOutLinksPerPage": -1,
        "urlFilters": [
        {
            "id": "eu.europa.ec.eurostat.wihp.MyFilter.2",
            "string1": "q",
            "integer2": 3,
            "number3": 3,
            "boolean4": false,
            "boolean41_pizza": true,
            "integer21_pizza": 7,
            "number31_pizza": 1.9,
            "array_string5": [ "q", "q", "Q" ],
            "array_integer6": [],
            "array_number7": [  3 ],
            "array_boolean8": [ false, false ]
        },
        {
            "id": "eu.europa.ec.eurostat.wihp.MyFilter.5",
            "string1": "t",
            "integer2": 3,
            "number3": 4.4,
            "boolean4": true,
            "boolean41_pizza": true,
            "integer21_pizza": 10,
            "number31_pizza": 1.9,
            "array_string5": [ "t", "t", "t" ],
            "array_integer6": [ 6,  7 ],
            "array_number7": [ 7, 7.1, 7.2, 7.3, 7.4 ],
            "array_boolean8": [ true, true, true, false, false, true ]
        },
        {
            "id": "eu.europa.ec.eurostat.wihp.MyFilter6",
            "param1": "s",
            "param2": [ 1, 2, 3, 4 ],
            "param3": {
                "param_object_1": "d",
                "param_object_2": 3,
                "param_object_3": {
                    "param_object_31": "ss"
                }
            },
            "paramArrayObj4": [
                {
                    "param_object_41": "d",
                    "param_object_42": 4,
                    "param_object_43": {
                        "param_object_431": "dd"
                    }
                },
                {
                    "param_object_41": "e",
                    "param_object_42": 5,
                    "param_object_43": {
                        "param_object_431": "rt"
                    }
                },
                {
                    "param_object_41": "h",
                    "param_object_42": 6,
                    "param_object_43": {
                        "param_object_431": "lLLL"
                    }
                }
            ]
        },
        {
            "id": "eu.europa.ec.eurostat.wihp.MyFilterSimple",
            "param1": "a",
            "param2": 3,
            "param3": 3.14,
            "param4": false,
            "param5": [ "q", "w" ],
            "param6": [ 5, 4 ],
            "param7": [ 9, 2.2 ],
            "param8": [ true, false, true ],
            "param9": {
                "param_object_1": "yYyYy",
                "param_object_2": 7,
                "param_object_3": 6.7,
                "param_object_4": false,
                "param_object_5": [ "a", "b" , "c", "d"]
            }
        }
    ],
        "parserFilters": [
        {
            "id": null,
            "className": "com.digitalpebble.stormcrawler.parse.filter.XPathFilter",
            "name": "XPathFilter",
            "params": {
                "canonical": "//*[@rel=\"canonical\"]/@href",
                "parse.description": [
                    "//*[@name=\"description\"]/@content",
                    "//*[@name=\"Description\"]/@content"
                ],
                "parse.title": [
                    "//TITLE",
                    "//META[@name=\"title\"]/@content"
                ],
                "parse.keywords": "//META[@name=\"keywords\"]/@content"
            }
        },
        {
            "id": null,
            "className": "com.digitalpebble.stormcrawler.filtering.basic.BasicURLFilter",
            "name": "BasicURLFilter",
            "params": {
                "maxPathRepetition": 3,
                "maxLength": 1024
            }
        },
        {
            "id": null,
            "className": "com.digitalpebble.stormcrawler.filtering.depth.MaxDepthFilter",
            "name": "MaxDepthFilter",
            "params": {
                "maxDepth": -1
            }
        },
        {
            "id": null,
            "className": "com.digitalpebble.stormcrawler.filtering.basic.BasicURLNormalizer",
            "name": "BasicURLNormalizer",
            "params": {
                "removeAnchorPart": false,
                "unmangleQueryString": true,
                "checkValidURI": true
            }
        },
        {
            "id": null,
            "className": "com.digitalpebble.stormcrawler.filtering.host.HostURLFilter",
            "name": "HostURLFilter",
            "params": {
                "ignoreOutsideHost": false,
                "ignoreOutsideDomain": true
            }
        },
        {
            "id": null,
            "className": "com.digitalpebble.stormcrawler.filtering.regex.RegexURLFilter",
            "name": "RegexURLFilter",
            "params": {
                "urlFilters": [
                    "# skip URLs with slash-delimited segment that repeats 3+ times, to break loops",
                    "# very time-consuming : use BasicURLFilter instead",
                    "# -.*(/[^/]+)/[^/]+\\1/[^/]+\\1/",
                    "# accept anything else",
                    "# +."
                ]
            }
        },
        {
            "id": null,
            "className": "eu.europa.ec.eurostat.wihp.filters.url.EsFastUrlFilter",
            "name": "FastURLFilter",
            "params": [
                {
                    "scope": "GLOBAL",
                    "patterns": [
                        "DenyPathQuery \\.jpg"
                    ]
                },
                {
                    "scope": "domain:stormcrawler.net",
                    "patterns": [
                        "AllowPath /digitalpebble/",
                        "DenyPath .+"
                    ]
                },
                {
                    "scope": "metadata:key=value",
                    "patterns": [
                        "DenyPath .+"
                    ]
                }
            ]
        }
    ]
    });

    // push extra crawler with "FastURLFilter"
    crawlers.push({
        "id": number + 2,
        "name": "with_FastURLFilter_3",
        "fetchInterval": 771,
        "fetchIntervalWhenError": 4419,
        "fetchIntervalWhenFetchError": 574,
        "extractorNoText": false,
        "extractorTextIncludePattern": "this is a long custom pattern",
        "extractorTextExcludeTags": "THOSE;ARE;TAGS",
        "httpContentLimit": 227,
        "emitOutLinks": true,
        "dynamic": true,
        "dynamicConfig": {
            "language": "ru-JP",
            "maximized": true,
            "windowSize": "1111,1111",
            "loadImages": "BLOCK",
            "allowCookies": "BLOCK",
            "allowGeolocation": "BLOCK"
        },
        "maxEmitOutLinksPerPage": -1,
        "urlFilters": [
            {
                "id": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.fasturlfilter.FastURLFilter",
                "rules": [
                    {
                        "scope": "domain:paixnidia-stratigikis.gr",
                        "patterns": [
                            "AllowPath /prosfores-2/",
                            "DenyPath .+"
                        ]
                    }
                ]
            }
        ],
        "parseFilters": [
            {
                "id": "eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicSeleniumFilter",
                "configuration": {
                    "steps": [
                        {
                            "action": "focus",
                            "xpath": "ahead",
                            "value": "111",
                            "highlight": false,
                            "screenshot": true
                        },
                        {
                            "action": "select",
                            "xpath": "all",
                            "value": "11",
                            "highlight": true,
                            "screenshot": false
                        }
                    ]
                }
            }
        ],
        'navigationFilters': [
            {
                'id': 'eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicSeleniumFilter',
                'configuration': {
                    'steps': [
                        {
                            'action': 'input',
                            'xpath': '//title',
                            'value': 'mytest',
                            'highlight': false,
                            'screenshot': true
                        }
                    ]
                }
            }
        ],
        "parserFilters": [
            {
                "id": null,
                "className": "com.digitalpebble.stormcrawler.parse.filter.XPathFilter",
                "name": "XPathFilter",
                "params": {
                    "canonical": "//*[@rel=\"canonical\"]/@href",
                    "parse.description": [
                        "//*[@name=\"description\"]/@content",
                        "//*[@name=\"Description\"]/@content"
                    ],
                    "parse.title": [
                        "//TITLE",
                        "//META[@name=\"title\"]/@content"
                    ],
                    "parse.keywords": "//META[@name=\"keywords\"]/@content"
                }
            },
            {
                "id": null,
                "className": "com.digitalpebble.stormcrawler.filtering.basic.BasicURLFilter",
                "name": "BasicURLFilter",
                "params": {
                    "maxPathRepetition": 3,
                    "maxLength": 1024
                }
            },
            {
                "id": null,
                "className": "com.digitalpebble.stormcrawler.filtering.depth.MaxDepthFilter",
                "name": "MaxDepthFilter",
                "params": {
                    "maxDepth": -1
                }
            },
            {
                "id": null,
                "className": "com.digitalpebble.stormcrawler.filtering.basic.BasicURLNormalizer",
                "name": "BasicURLNormalizer",
                "params": {
                    "removeAnchorPart": false,
                    "unmangleQueryString": true,
                    "checkValidURI": true
                }
            },
            {
                "id": null,
                "className": "com.digitalpebble.stormcrawler.filtering.host.HostURLFilter",
                "name": "HostURLFilter",
                "params": {
                    "ignoreOutsideHost": false,
                    "ignoreOutsideDomain": true
                }
            },
            {
                "id": null,
                "className": "com.digitalpebble.stormcrawler.filtering.regex.RegexURLFilter",
                "name": "RegexURLFilter",
                "params": {
                    "urlFilters": [
                        "# skip URLs with slash-delimited segment that repeats 3+ times, to break loops",
                        "# very time-consuming : use BasicURLFilter instead",
                        "# -.*(/[^/]+)/[^/]+\\1/[^/]+\\1/",
                        "# accept anything else",
                        "# +."
                    ]
                }
            },
            {
                "id": null,
                "className": "eu.europa.ec.eurostat.wihp.filters.url.EsFastUrlFilter",
                "name": "FastURLFilter",
                "params": [
                    {
                        "scope": "GLOBAL",
                        "patterns": [
                            "DenyPathQuery \\.jpg"
                        ]
                    },
                    {
                        "scope": "domain:stormcrawler.net",
                        "patterns": [
                            "AllowPath /digitalpebble/",
                            "DenyPath .+"
                        ]
                    },
                    {
                        "scope": "metadata:key=value",
                        "patterns": [
                            "DenyPath .+"
                        ]
                    }
                ]
            }
        ]
    });

    return crawlers;
};

const generateCrawlers = () => {
    return generateCrawlersData(4);
};

module.exports = {
    getCrawlers: generateCrawlers,
    getCrawlersData: generateCrawlersData
};
