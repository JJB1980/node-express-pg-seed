const sql = require('./sql');
const {query} = require('./pg');
const {mockData} = require('./mocks');
const {environment} = require('../utils');
const {log} = require('../utils/logger');
const {getDecodedJwt} = require('../auth/common');

async function dataApi (action, args = [], request = {headers: {}}) {
  if (environment === 'test') {
    return mockData(action, args);
  } else {
    log(action, args, 'dataApi', getDecodedJwt(request).id);
    return await query(sql[action], args);
  }
}

module.exports = {
  dataApi
};
