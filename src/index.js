const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {routes} = require('./routes');
const {dbRoutes} = require('./data/routes');
const {authRoutes} = require('./auth/routes');
const {userRoutes} = require('./users/routes');
const {authorizeHeader} = require('./auth/');
const {closeConnection, initDB} = require('./data/pg');
const {initMail} = require('./utils');
const compression = require('compression');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(compression());

// auth on routes
app.use((request, response, next) => {
  if (authorizeHeader(request, response)) next();
});

// setup routes
routes(app);
dbRoutes(app);
authRoutes(app);
userRoutes(app);

// initialisation
initMail();
initDB();

const port = process.env.PORT || 8081;
const server = app.listen(port, function () {
  const {address, port} = server.address()
  console.log(`Example app listening at http://${address}:${port}`);
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
