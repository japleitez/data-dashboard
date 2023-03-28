const generateParseFiltersData = (number) => {
    const parseFilters = [];
    for (let index = 1; index < number; index++) {
        parseFilters.push(generateFilterParseData(index));
    }
    return parseFilters;
};

const generateFilterParseData = (number) => {

    if([3].includes(number) ){
        return objectsBasicSeleniumFilterJson(number);
    }

    return simpleParseFilterJson(number);
}

const simpleParseFilterJson = (number) => {
    return {
        'id': 'eu.europa.ec.eurostat.wihp.MyFilter.' + number,
        'name': {
            'default': 'My filter number ' + number,
            'translationKey': 'my.filter.translation.key.' + number
        },
        'help': {
            'default': 'My Filter Fake Help'
        },
        'parameters': [
            {
                'id': 'string1',
                'name': {
                    'default': 'String parameter 1',
                    'translationKey': 'my.string.parameter1'
                },
                'type': {
                    'type': 'string',
                    'required': true,
                    'pattern': '^[a-zA-Z]*$',
                    'maxLength': 10,
                    'minLength': 1
                },
                'help': {
                    'default': 'string1 help'
                },
            },
            {
                'id': 'integer2',
                'name': {
                    'default': 'Integer parameter 2',
                    'translationKey': 'my.integer.parameter2'
                },
                'type': {
                    'type': 'integer',
                    'required': true,
                    'minimum': 0,
                    'maximum': 10
                },
                'help': {
                    'default': 'integer2 help'
                },
            },
            {
                'id': 'number3',
                'name': {
                    'default': 'Number parameter 3',
                    'translationKey': 'my.number.parameter3'
                },
                'type': {
                    'type': 'number',
                    'required': true,
                    'minimum': 2.56,
                    'maximum': 10.37
                },
                'help': {
                    'default': 'number3 help'
                },
            },
            {
                'id': 'boolean4',
                'name': {
                    'default': 'Boolean parameter 4',
                    'translationKey': 'my.boolean.parameter4'
                },
                'type': {
                    'type': 'boolean',
                    'required': true
                },
                'help': {
                    'default': 'boolean4 help'
                },
            },
            {
                'id': 'boolean41_pizza',
                'name': {
                    'default': 'Do you like pizza ?',
                    'translationKey': 'my.boolean.parameter41'
                },
                'type': {
                    'type': 'boolean',
                    'required': true
                }
            },
            {
                'id': 'integer21_pizza',
                'name': {
                    'default': 'How many pizzas do you eat per week ?',
                    'translationKey': 'my.integer.parameter11'
                },
                'type': {
                    'type': 'number',
                    'required': true,
                    'minimum': 5,
                    'maximum': 100
                },
                'help': {
                    'default': 'Please enter number of pizza '
                }
            },
            {
                'id': 'number31_pizza',
                'name': {
                    'default': 'What pizza size is preferable (in m) ?',
                    'translationKey': 'my.number.parameter31'
                },
                'type': {
                    'type': 'number',
                    'required': true,
                    'minimum': 0.1,
                    'maximum': 1.9
                },
                'help': {
                    'default': 'Please enter size of pizza '
                }
            },
            {
                'id': 'array_string5',
                'name': {
                    'default': 'Array string parameter 5',
                    'translationKey': 'my.array.string.parameter5'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'string',
                    'pattern': '^[a-zA-Z]*$',
                    'maxLength': 10,
                    'minLength': 1,
                    'minArrayLength': 2,
                    'maxArrayLength': 6
                }
            },
            {
                'id': 'array_integer6',
                'name': {
                    'default': 'Array integer parameter 6',
                    'translationKey': 'my.array.integer.parameter6'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'integer',
                    'minimum': 0,
                    'maximum': 10,
                    'minArrayLength': 0,
                    'maxArrayLength': 7
                },
                'help': {
                    'default': 'Help for Array integer parameter 6 '
                }
            },
            {
                'id': 'array_number7',
                'name': {
                    'default': 'Array number parameter 7',
                    'translationKey': 'my.array.number.parameter7'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'number',
                    'minimum': 1.2,
                    'maximum': 10.5,
                    'minArrayLength': 1,
                    'maxArrayLength': 10
                }
            },
            {
                'id': 'array_boolean8',
                'name': {
                    'default': 'Array boolean parameter 8',
                    'translationKey': 'my.array.boolean.parameter8'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'boolean',
                    'minArrayLength': 2,
                    'maxArrayLength': 10
                },
                'help': {
                    'default': 'Help for Array boolean parameter 8 '
                }
            }
        ]
    };
};


const objectsBasicSeleniumFilterJson = (number) => {
    return {
        "id": "eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicSeleniumFilter",
        "name": {
            "default": "Basic Selenium Filter",
            "translationKey": "eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicSeleniumFilter"
        },
        "help": {
            "default": "With Basic Selenium Filter you can define your own custom navigation steps in a page"
        },
        "parameters": [
            {
                "id": "steps",
                "name": {
                    "default": "Steps",
                    "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.steps"
                },
                "type": {
                    "type": "array",
                    "required": false,
                    "arrayType": "object",
                    "minArrayLength": 1,
                    "maxArrayLength": 100,
                    "parameters": [
                        {
                            "id": "action",
                            "name": {
                                "default": "Action",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.scope"
                            },
                            "type": {
                                "type": "string",
                                "required": true,
                                "pattern": "^(click)|(input)|(focus)|(select)|(scroll)|(wait)"
                            },
                            "help": {
                                "default": "The scope of the regex rule organized by [host | domain | metadata | global]"
                            }
                        },
                        {
                            "id": "xpath",
                            "name": {
                                "default": "Xpath",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns"
                            },
                            "type": {
                                "type": "string",
                                "required": true,
                                "maxLength": 1024,
                                "minLength": 1
                            },
                            "help": {
                                "default": "List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]"
                            }
                        },
                        {
                            "id": "value",
                            "name": {
                                "default": "Value",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns"
                            },
                            "type": {
                                "type": "string",
                                "required": false,
                                "maxLength": 1024
                            },
                            "help": {
                                "default": "List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]"
                            }
                        },
                        {
                            "id": "highlight",
                            "name": {
                                "default": "Highlight",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns"
                            },
                            "type": {
                                "type": "boolean",
                                "required": true
                            },
                            "help": {
                                "default": "List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]"
                            }
                        },
                        {
                            "id": "screenshot",
                            "name": {
                                "default": "Screenshot",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns"
                            },
                            "type": {
                                "type": "boolean",
                                "required": true
                            },
                            "help": {
                                "default": "List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]"
                            }
                        }
                    ]
                },
                "help": {
                    "default": "The list of scoped-based regular expressions"
                }
            }
        ]
    }
}

const generateParseFilters = () => {
    return generateParseFiltersData(8);
};

module.exports = {
    getParseFilters: generateParseFilters
};
