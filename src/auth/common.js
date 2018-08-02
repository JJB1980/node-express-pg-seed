const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');

const {config: {auth: {jwtKey}}} = require('../utils');

function getDecodedJwt (request) {
  const {authorization} = request.headers;
  if (!authorization) return {status: 'no-auth'};
  const decoded = jwt.verify(authorization, jwtKey);
  return decoded;
}

function validatePassword (password, verifyPassword) {
  return passwordHash.verify(password, verifyPassword);
}

module.exports = {
  getDecodedJwt,
  validatePassword
};
