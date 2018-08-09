const {mockUserData} = require('./mocks/users');

function mockData (action, args) {
  try {
    return mockUserData(action, args);
  } catch (e) {
    if (e.message !== 'NA') throw new Error(e.message);
  }
  return {};
}

module.exports = {
  mockData
};
