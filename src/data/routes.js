const {query} = require('./pg');
const sqlInstall = require('./install');
// const passwordHash = require('password-hash');

function dbRoutes (app) {
  app.get('/database/test', async (request, response) => {
    const result = await query('select NOW() as datetime;');
    response.json(result);
  });

  app.get('/database/install', (request, response) => {
    install(request, response);
  });
}

async function install (request, response) {
  const errors = [];
  const success = [];
  for (const key in sqlInstall) {
    const version = sqlInstall[key];
    for (let i = 0; i < version.length; i++) {
      const sql = version[i];
      try {
        await query(sql);
        success.push({key, i});
      } catch (e) {
        errors.push({key, i, errors: e.toString()});
      }
    }
  }
  response.json({
    success,
    errors
  });
}

module.exports = {
  dbRoutes
};
