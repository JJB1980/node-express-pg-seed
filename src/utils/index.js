const jsonConfig = require('../../config/config.json');

const environment = process.env.NODE_ENV || 'development';

function getIP (request) {
  return request.ip || request.headers['x-forwarded-for'] || request.connection.remoteAddress;
}

function configuration () {
  return jsonConfig[environment === 'test' ? 'development' : environment];
}

module.exports = {
  getIP,
  config: configuration(),
  environment
};
