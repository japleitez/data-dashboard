const generateCrawlerImportError = () => {
    const fieldsErrors = [];
    fieldsErrors.push({
        objectName: 'crawler',
        field: 'name',
        message: 'must match \"^(?=.*[a-zA-Z\\d].*)[a-zA-Z\\d _.]{1,}$\"'
        }
    );
    fieldsErrors.push({
            objectName: 'crawler',
            field: 'fetchInterval',
            message: 'must be greater than or equal to -1'
        }
    );
    const sourceErrors = [];
    for (let index = 1; index <= 28; index++) {
        sourceErrors.push({
                name: 'source$' + index,
                url: 'http://source$' + index + '.com',
                errors: [
                    'The name has illegal character',
                    'The url is not valid'
                ]
            }
        );
    }
    return { fieldErrors: fieldsErrors, sourceErrors: sourceErrors };
};

module.exports = {
    getCrawlerImportError: generateCrawlerImportError,
};
