const faker = require('faker');

const statuses = ['PROVISIONING', 'QUEUED', 'RUNNING', 'PAUSED', 'SUCCESS', 'SUCCESS']

const generateAcquisitions = () => {
    const acquisitions = [];
    for(let i=0; i< 20; i++) {
        acquisitions.push({
            "id": i,
            "workflowId": faker.datatype.uuid(),
            "crawlerName": 'crawler_' + faker.datatype.number({min:1,max:100}),
            "startDate": faker.date.recent(),
            "lastUpdateDate": faker.date.future(),
            "status": statuses[i%6]
         });
    }
    return acquisitions;
};


module.exports = {
    getAcquisitions: generateAcquisitions
};
