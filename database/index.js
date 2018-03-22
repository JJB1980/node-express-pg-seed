const { Pool } = require('pg');

const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env].database;

let pool = null;
if (!process.env.PGUSER) {
  pool = new Pool({...dbConfig});
} else {
  pool = new Pool();
}

function query (sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res.rows);
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
  closeConnection
};
