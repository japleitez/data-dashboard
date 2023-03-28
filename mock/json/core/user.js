function generateUserDetails() {
  return {
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "organisationRef": {
      "id": "123456", "abbreviation": "DIGIT.B.3"
    },
    "userId": "johndoe",
    "email": "John.DOE@ec.europa.eu",
    "rights": [
        { id: 'Home_Module', permissions: ['toSeeAdminText'] },
        { id: 'ACCESSIBLE', permissions: ['toSeeText', 'toClickButton'] },
        // { id: 'INACCESSIBLE' },
    ]
  };
}

function generateUserPreferences() {
  return {
    "tz": {
      "primary": "Europe/Brussels",
      "secondary": "Europe/Brussels",
      "HQ": "Europe/Brussels"
    },
    "notifications": {
      "isActive": true,
      "pullingFrequency": null
    }
  };
}

module.exports.generateUserDetails = generateUserDetails;
module.exports.generateUserPreferences = generateUserPreferences;
