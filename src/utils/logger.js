const dateFns = require('date-fns');
const fs = require('fs');
const path = require('path');

let logStream = null;

function initLogger () {
  try {
    const file = '/var/log/example-app.log';
    logStream = fs.createWriteStream(file, {'flags': 'a'});
    logStream.on('error', function(err) {
      console.log('Unable to initalise logger.')
      logStream.end();
      logStream = null;
    });
  } catch (e) {
    console.log(e);
  }
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
