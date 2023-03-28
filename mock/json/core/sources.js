const generateSourcesData = (number) => {
    const sources = [];
    let max = number + 1;
    for (let index = 1; index < max; index++) {

        sources.push({
                id: index,
                name: 'source' + index,
                url: 'http://source' + index
            }
        );
        number--;
    }
    return sources;
};

const generateSources = () => {
    return generateSourcesData(6);
};

module.exports = {
    getSources: generateSources,
    getSourcesData: generateSourcesData
};
