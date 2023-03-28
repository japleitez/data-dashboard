const generateNavigationFiltersData = (number) => {
    const filters = [];
    for (let index = 1; index < number; index++) {
        filters.push(generateNavigationFilterData(index));
    }
    return filters;
};

const generateNavigationFilterData = (number) => {
    return basicNavigationFilterJson(number);
}

const basicNavigationFilterJson = (number) => {
    const baseKey = 'eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicNavigationFilter';
    const numberKey = baseKey + number;
    const stepsKey = baseKey + numberKey + '.steps'
    return{
        'id': numberKey,
        'name': {
            'default': 'Basic Selenium Filter ' + number,
            'translationKey': numberKey
        },
        'help': {
            'default': 'With Basic Navigation Filter you can define your own custom navigation steps in a page'
        },
        'parameters': [
            {
                'id': 'steps',
                'name': {
                    'default': 'Steps',
                    'translationKey': stepsKey
                },
                'type': {
                    'type': 'array',
                    'required': false,
                    'arrayType': 'object',
                    'minArrayLength': 1,
                    'maxArrayLength': 100,
                    'parameters': [
                        {
                            'id': 'action',
                            'name': {
                                'default': 'Action',
                                'translationKey': stepsKey + '.action'
                            },
                            'type': {
                                'type': 'string',
                                'required': true,
                                'pattern': '^(click)|(input)|(focus)|(select)|(scroll)|(wait)|(addUrl)$'
                            },
                            'help': {
                                'default': 'The available actions are click, input, focus, select, scroll, wait, addUrl. The addUrl adds the current URL to the end of the HTML document and it is useful if the actions are discovering a new URL, like the next page of a search result.'
                            }
                        },
                        {
                            'id': 'xpath',
                            'name': {
                                'default': 'Xpath',
                                'translationKey': stepsKey + '.xpath'
                            },
                            'type': {
                                'type': 'string',
                                'required': false,
                                'maxLength': 1024,
                                'minLength': 1
                            },
                            'help': {
                                'default': 'An optional Xpath to apply the action'
                            }
                        },
                        {
                            'id': 'value',
                            'name': {
                                'default': 'Value',
                                'translationKey': stepsKey + '.value'
                            },
                            'type': {
                                'type': 'string',
                                'required': false,
                                'maxLength': 1024
                            },
                            'help': {
                                'default': 'A value that can be applied to an action. Only input, scroll and wait are using the value'
                            }
                        },
                        {
                            'id': 'highlight',
                            'name': {
                                'default': 'Highlight',
                                'translationKey': stepsKey + '.highlight'
                            },
                            'type': {
                                'type': 'boolean',
                                'required': true
                            },
                            'help': {
                                'default': 'This will highlight the html element that you specified in the Xpath with a red border and a yellow background colour'
                            }
                        },
                        {
                            'id': 'screenshot',
                            'name': {
                                'default': 'Screenshot',
                                'translationKey': stepsKey + '.screenshot'
                            },
                            'type': {
                                'type': 'boolean',
                                'required': true
                            },
                            'help': {
                                'default': 'This option will take a screenshot after the execution of the action'
                            }
                        }
                    ]
                },
                'help': {
                    'default': 'The list of selenium actions'
                }
            }
        ]
    };
};

const generateNavigationFilters = () => {
    return generateNavigationFiltersData(12);
};

module.exports = {
    getNavigationFilters: generateNavigationFilters,
    getNavigationFiltersData: generateNavigationFiltersData
};
