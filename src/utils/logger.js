const dateFns = require('date-fns');

const {getDecodedJwt} = require('../auth/common');

function log (action, args, source, request = {headers: {}}) {
  const date = new Date();
  const obj = {
    date: dateFns.format(date, 'YYYY-MM-DD'),
    time:  dateFns.format(date, 'HH:mm:ss.SSS'),
    source,
    action,
    args,
    user: getDecodedJwt(request).id
  };
  console.log(JSON.stringify(obj));
}

module.exports = {
  log
};
