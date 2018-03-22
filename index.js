const express = require('express');
const bodyParser = require('body-parser');

const {routes} = require('./routes');
const {dbRoutes} = require('./database/routes');
// const {closeConnection} = require('./database/index.js');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

routes(app);
dbRoutes(app);

const port = process.env.PORT || 80;
const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});

// let exited = false;
// function cleanUpServer () {
//   if (exited) return;
//   closeConnection();
//   console.log('AppEnd...');
//   process.exit();
//   exited = true;
// }

// ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
//   process.on(eventType, cleanUpServer.bind(null, eventType));
// });
