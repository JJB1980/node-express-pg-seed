const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');

const {USER_SELECT} = require('../database/sql');
const {query} = require('../database/');
const {config: {auth: {jwtKey}}} = require('../config');
const {getIP} = require('../utils');
// 0397055200

const whiteList = [
  '/auth/login',
  '/user/signup',
  '/user/requestPasswordReset',
  '/user/validateResetPassword',
  '/user/resetPassword',
  '/user/validateEmail'
];
const adminRoutes = [
  '/database'
];

function authorizeHeader (request, response) {
  // if (whiteList.find(path => path === request.originalUrl)) {
  if (whiteList.find(path => request.originalUrl.indexOf(path) >= 0)) {
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
    const {isAdmin, ua: jwtUa, ip: jwtIp} = decoded;
    if (adminRoutes.find(path => request.originalUrl.indexOf(path) >= 1) && !isAdmin) {
      response.status(401);
      response.json({error: 'Unauthorized.'});
      return false;
    } else {
      const ua = request.headers['user-agent'];
      const ip = getIP(request);
      if (ua === jwtUa && ip === jwtIp) {
        return {success: true, isAdmin};
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

async function login (request, response) {
  try {
    const {email, password} = request.body;
    const result = await query(USER_SELECT, [email]);
    if (!result.length) {
      response.status(401);
      response.json({sucess: false, error: 'Invalid user.'});
      return;
    }
    const {password: verifyPassword, admin} = result[0];
    const verified = passwordHash.verify(password, verifyPassword);
    if (!verified) {
      response.status(401);
      response.json({sucess: false, error: 'Invalid password.'});
      return;
    }
    const ua = request.headers['user-agent'];
    const ip = getIP(request);
    const token = jwt.sign({ email, isAdmin: admin, ua, ip }, jwtKey);
    response.json({success: true, token, isAdmin: admin});
  } catch (e) {
    response.status(401);
    response.json({success: false, error: e.toString()});
  }
}

module.exports = {
  authorizeHeader,
  login
};
