const faker = require('faker');

const getBuildings = () => {
    const buildings = [];
    for(let i=0; i<Math.random() * 100; i++) {
        buildings.push({
            buildingId: i,
            name: `${faker.name.findName()} ${faker.address.streetName()}`,
            address: {
                street: faker.address.streetName(),
                postalCode: faker.address.zipCode(),
                country: faker.address.country(),
                city: faker.address.city(),
            }
        })
    }
    return buildings;
}

module.exports = {
    getBuildings
};
