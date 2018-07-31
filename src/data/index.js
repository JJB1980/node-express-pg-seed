const sql = require('./sql');
const {query} = require('./pg');
const {mockData} = require('./mocks');
const {environment} = require('../utils');

async function dataApi (action, args = []) {
  if (environment === 'test') {
    return mockData(action, args);
  } else {
    return await query(sql[action], args);
  }
}

module.exports = {
  dataApi
};
