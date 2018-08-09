const jwt = require('jsonwebtoken');

const {USER_SELECT} = require('../data/actions');
const {dataApi} = require('../data');
const {getIP, config: {auth: {jwtKey}}} = require('../utils');
const {getDecodedJwt, validatePassword} = require('./common');

const whiteList = [
  '/auth/login',
  '/user/signup',
  '/user/register',
  '/user/requestPasswordReset',
  '/user/validateResetPassword',
  '/user/resetPassword',
  '/user/validateEmail',
];
const adminRoutes = [
  '/database'
];

function authorizeHeader (request, response) {
  if (whiteList.find(path => request.originalUrl === path)) {
    return {success: true};
  }
  const {authorization} = request.headers;
  if (!authorization) {
    response.status(401);
    response.json({error: 'No authorization token.'});
    return false;
  }
  try {
    const decoded = getDecodedJwt(request);
    const {isAdmin, ua: jwtUa, ip: jwtIp, firstname, lastname, id} = decoded;
    const adminRoute = adminRoutes.find(path => request.originalUrl === path);
    if (adminRoute && !isAdmin) {
      response.status(401);
      response.json({error: 'Unauthorized.'});
      return false;
    } else {
      const ua = request.headers['user-agent'];
      const ip = getIP(request);
      if (isAdmin || (ua === jwtUa && ip === jwtIp)) {
        return {success: true, isAdmin, firstname, lastname};
      } else {
        response.status(401);
        response.json({error: 'Config does not match.'});
        return false;
      }
    }
  } catch (e) {
    // console.log(e);
    response.status(401);
    response.json({error: 'Invalid token.'});
    return false;
  }
}

async function login (request, response) {
  try {
    const {email, password} = request.body;
    const result = await dataApi(USER_SELECT, [email], request);
    if (!result.length) {
      response.status(401);
      response.json({sucess: false, error: 'Invalid user.'});
      return;
    }
    const {password: verifyPassword, admin, firstname, lastname, id} = result[0];
    const verified = validatePassword(password, verifyPassword);
    if (!verified) {
      response.status(401);
      response.json({success: false, error: 'Invalid password.'});
      return;
    }
    const ua = request.headers['user-agent'];
    const ip = getIP(request);
    const token = jwt.sign({email, isAdmin: admin, ua, ip, firstname, lastname, id}, jwtKey);
    response.json({success: true, data: {token, isAdmin: admin, firstname, lastname}});
  } catch (e) {
    response.status(401);
    response.json({success: false, error: e.toString()});
  }
}

module.exports = {
  authorizeHeader,
  login
};
