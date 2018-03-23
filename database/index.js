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

function query (sql, args = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, args, (err, res) => {
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
