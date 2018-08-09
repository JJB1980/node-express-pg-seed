const dateFns = require('date-fns');
const fs = require('fs');
const path = require('path');

let logStream = null;

function initLogger () {
  const file = '/var/log/example-app.log';
  logStream = fs.createWriteStream(file, {'flags': 'a'});
}

function log (action, args, source, user) {
  if (!logStream) return;
  const date = new Date();
  const obj = {
    date: dateFns.format(date, 'YYYY-MM-DD'),
    time:  dateFns.format(date, 'HH:mm:ss.SSS'),
    source,
    action,
    args,
    user
  };
  logStream.write(JSON.stringify(obj) + '\n');
}

module.exports = {
  initLogger,
  log
};
