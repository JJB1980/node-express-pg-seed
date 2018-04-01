const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const {SELECT_USER} = require('../database/sql');
const {query} = require('../database/');
const {authorizeHeader} = require('./');
const {config: {auth: {jwtKey}}} = require('../config');

function authRoutes (app) {
  app.post('/auth/login', async (request, response) => {
    try {
      const {email, password} = request.body;
      const result = await query(SELECT_USER, [email]);
      if (!result.length) {
        response.status(401);
        response.json({sucess: false, error: 'Invalid user.'});
        return;
      }
      const pwd = result[0].password;
      const verified = passwordHash.verify(password, pwd);
      if (!verified) {
        response.status(401);
        response.json({sucess: false, error: 'Invalid password.'});
        return;
      }
      const {admin} = result[0];
      const ua = request.headers['user-agent'];
      const token = jwt.sign({ email, isAdmin: admin, ua }, jwtKey);
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
