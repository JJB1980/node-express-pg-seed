const sql = require('./sql');
const {query} = require('./pg');
const mocks = require('./mocks');

async function dataApi (command, args = []) {
  if (process.env.NODE_ENV === 'test') {
    return mocks.stubData(command, args);
  } else {
    return await query(sql[command], args);
  }
}

module.exports = {
  dataApi
};
