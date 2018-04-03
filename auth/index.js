const jwt = require('jsonwebtoken');
const {config: {auth: {jwtKey}}} = require('../config');
const {getIP} = require('../utils');

const whiteList = [
  '/auth/login',
  '/user/signup',
  '/user/resetPassword'
];
const adminRoutes = [
  '/database'
];

function authorizeHeader (request, response) {
  if (whiteList.find(path => path === request.originalUrl)) {
    return {success: true};
  }
  const {authorization} = request.headers;
  if (!authorization) {
    response.status(401);
    response.json({error: 'No authorization token.'});
    return false;
  }
  try {
    const decoded = jwt.verify(authorization, jwtKey);
    if (adminRoutes.find(path => request.originalUrl.indexOf(path) >= 1) && !decoded.isAdmin) {
      response.status(401);
      response.json({error: 'Unauthorized.'});
      return false;
    } else {
      const ua = request.headers['user-agent'];
      const ip = getIP(request);
      if (ua === decoded.ua && ip === decoded.ip) {
        return {success: true, isAdmin: decoded.isAdmin};
      } else {
        return false;
      }
    }
  } catch (e) {
    response.status(401);
    response.json({error: 'Invalid token.'});
    return false;
  }
}

module.exports = {
  authorizeHeader
};
