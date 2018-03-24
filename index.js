const express = require('express');
const bodyParser = require('body-parser');

const {routes} = require('./routes');
const {dbRoutes} = require('./database/routes');
const {authRoutes} = require('./auth/routes');
const {authorizeHeader} = require('./auth/');
const {closeConnection} = require('./database/index.js');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// auth on routes
app.use('*', (request, response, next) => {
  if (authorizeHeader(request, response)) next();
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// setup routes
routes(app);
dbRoutes(app);
authRoutes(app);

const port = process.env.PORT || 8081;
const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});

// ensure connections close in prod.
let exited = false;
function cleanUpServer () {
  if (exited) return;
  closeConnection();
  console.log('AppEnd...');
  process.exit();
  exited = true;
}

if (process.env.NODE_ENV === 'production') {
  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, cleanUpServer.bind(null, eventType));
  });
}
