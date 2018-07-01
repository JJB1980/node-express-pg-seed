const { Pool } = require('pg');
const {config} = require('../utils');

const dbConfig = config.database;
let pool = null;

function initDB () {
  if (!process.env.production) {
    pool = new Pool({...dbConfig});
  } else {
    pool = new Pool();
  }
}

function query (sql, args = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, args, (error, response) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(response.rows);
    });
  });
}

let endFlag = false;
function closeConnection () {
  if (!endFlag) {
    pool.end();
    endFlag = true;
  }
}

module.exports = {
  query,
  closeConnection,
  initDB
};
