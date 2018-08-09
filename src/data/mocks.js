const {mockUserData} = require('./mocks/users');

function mockData (action, args) {
  return mockUserData(action, args);
}

module.exports = {
  mockData
};
