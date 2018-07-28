const sql = require('./sql');
const {query} = require('./pg');
const mocks = require('./mocks');

async function dataApi (action, args = []) {
  if (process.env.NODE_ENV === 'test') {
    return mocks.stubData(action, args);
  } else {
    return await query(sql[action], args);
  }
}

module.exports = {
  dataApi
};
