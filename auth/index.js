const jwt = require('jsonwebtoken');
const {config: {auth: {jwtKey}}} = require('../config');

const whiteList = [
  '/auth/login'
];
const adminRoutes = [
  '/database'
];

function authorizeHeader (request, response) {
  if (whiteList.find(path => path === request.originalUrl)) {
    return true;
  }
  const {authorization} = request.headers;
  if (!authorization) {
    response.status(401);
    response.json({error: 'No authorization token.'});
    return false;
  }
  try {
    const decoded = jwt.verify(authorization, jwtKey);
    if (adminRoutes.find(path => request.originalUrl.indexOf(path) >= 1) && !decoded.admin) {
      response.status(401);
      response.json({error: 'Unauthorized.'});
      return false;
    }
  } catch (e) {
    response.status(401);
    response.json({error: 'Invalid token.'});
    return false;
  }
  return true;
}

module.exports = {
  authorizeHeader
};
