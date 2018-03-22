const {query} = require('./');
const sqlInstall = require('./install');

function dbRoutes (app) {
  app.get('/database/test', async (request, response) => {
    const result = await query('select NOW() as datetime;');
    response.json(result);
  });

  app.get('/database/install', (request, response) => {
    install(request, response);
  });
}

function install(request, response) {
  let error = null;
  for (const key in sqlInstall) {
    const version = sqlInstall[key];
    if (error) return;
    version.forEach(async (sql) => {
      try {
        const result = await query(sql);
        if (!result) {
          error = 'No result.';
          return;
        }
      } catch (e) {
        error = e.toString();
        return;
      }
    });
  }
  if (!error) response.send('Success!');
  if (error) response.send(error);
}

module.exports = {
  dbRoutes
};
