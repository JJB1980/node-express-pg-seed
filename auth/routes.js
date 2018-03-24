const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const {query} = require('../database/');
const {authorizeHeader} = require('./');
const {config: {auth: {jwtKey}}} = require('../config');

function authRoutes (app) {
  app.post('/auth/login', async (request, response) => {
    try {
      const {email, password} = request.body;
      const result = await query('select * from users where email = $1;', [email]);
      if (!result.length) {
        response.status(401);
        response.json({sucess: false, error: 'Invalid user.'});
        return;
      }
      const pwd = result[0].password;
      const verified = passwordHash.verify(password, pwd);
      if (!verified) {
        response.status(401);
        response.json({sucess: false, error: 'Invalid passwords.'});
        return;
      }
      const {admin} = result[0];
      const token = jwt.sign({ email, admin }, jwtKey);
      response.json({success: true, token});

    } catch (e) {
      response.status(401);
      response.json({success: false, error: e.toString()});
    }
  });

  app.get('/auth/authenticate', (request, response) => {
    if (authorizeHeader(request, response)) {
      response.json({success: true, authenticated: true});
    }
  });
}

module.exports = {
  authRoutes
};
