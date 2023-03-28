const faker = require('faker');

const generateConfigsData = (number) => {
    const configs = [];
    let max = number + 1;
    for (let index = 1; index < max; index++) {

        configs.push({
                id: index,
                name: 'name' + index,
                file: 'file' + index,
                acquisitionId: 1
            }
        );
        number--;
    }
    return configs;
};

const generateConfigs = () => {
    return generateConfigsData(80);
};

module.exports = {
    getConfigs: generateConfigs,
    getConfigsData: generateConfigsData
};
