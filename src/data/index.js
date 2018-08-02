const sql = require('./sql');
const {query} = require('./pg');
const {mockData} = require('./mocks');
const {environment} = require('../utils');
const {log} = require('../utils/logger');

async function dataApi (action, args = [], request) {
  if (environment === 'test') {
    return mockData(action, args);
  } else {
    log(action, args, 'dataApi', request);
    return await query(sql[action], args);
  }
}

module.exports = {
  dataApi
};
