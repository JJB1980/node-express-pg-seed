const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const {USER_SELECT} = require('../database/sql');
const {query} = require('../database/');
const {authorizeHeader} = require('./');
const {config: {auth: {jwtKey}}} = require('../config');
const {getIP} = require('../utils');

function authRoutes (app) {
  app.post('/auth/login', async (request, response) => {
    try {
      const {email, password} = request.body;
      const result = await query(USER_SELECT, [email]);
      if (!result.length) {
        response.status(401);
        response.json({sucess: false, error: 'Invalid user.'});
        return;
      }
      const verified = passwordHash.verify(password, result[0].password);
      if (!verified) {
        response.status(401);
        response.json({sucess: false, error: 'Invalid password.'});
        return;
      }
      const {admin} = result[0];
      const ua = request.headers['user-agent'];
      const ip = getIP(request);
      const token = jwt.sign({ email, isAdmin: admin, ua, ip }, jwtKey);
      response.json({success: true, token, isAdmin: admin});
    } catch (e) {
      response.status(401);
      response.json({success: false, error: e.toString()});
    }
  });

  app.get('/auth/authenticate', (request, response) => {
    const result = authorizeHeader(request, response);
    if (result && result.success) {
      response.json({success: true, authenticated: true, isAdmin: result.isAdmin});
    }
  });
}

module.exports = {
  authRoutes
};
