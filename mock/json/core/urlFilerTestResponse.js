const generateFilterUrlTestResponse = (filterId) => {
    let blablaResult;
    const today = new Date();
    return {
        'urls': [
            {
                'url': ' FILTER: ' + filterId + '  TIME_STAMP: ' + today.toUTCString(),
                'result': true
            },
            {
                'url': 'https://www.test.com',
                'result': true
            },
            {
                'url': 'https://www.google.com',
                'result': false
            },
            {
                'url': 'invalid',
                'result': null
            },
            {
                'url': 'bla bla',
                'result': blablaResult
            },
            {
                'url': 'bla bla 2',
                'result': null
            },
            {
                'url': 'bla bla 3',
                'result': null
            },
            {
                'url': 'http://www.arhs.com',
                'result': false
            }
        ]
    };
};

module.exports = {
    getFilterUrlTestResponse: generateFilterUrlTestResponse,
};
