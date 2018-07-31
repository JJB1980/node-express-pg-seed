const {mockUserData} = require('../users/mocks');

function mockData (action, args) {
  return mockUserData(action, args);
}

module.exports = {
  mockData
};
