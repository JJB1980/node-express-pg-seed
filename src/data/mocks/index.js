const {stubUserData} = require('./users');

function stubData (action, args) {
  return stubUserData(action, args);
}

module.exports = {
  stubData
};
