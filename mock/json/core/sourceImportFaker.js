const generateSourcesImportError = () => {
    const errorEntries = [];
    for (let index = 1; index <= 28; index++) {
        errorEntries.push({
                name: 'source$' + index,
                url: 'http://source$' + index + '.com',
                errors: [
                    'The name has illegal character',
                    'The url is not valid'
                ]
            }
        );
    }
    return { sources: errorEntries };
};

module.exports = {
    getSourcesImportError: generateSourcesImportError,
};
