const sql = require('./sql');
const {query} = require('./pg');

async function dataApi (command, args = []) {
  if (process.env.NODE_ENV === 'TEST') {
    // stub data
  } else {
    return await query(sql[command], args)
  }
}

module.exports = {
  dataApi
};
