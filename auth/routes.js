const {authorizeHeader, login} = require('./');

function authRoutes (app) {
  app.post('/auth/login', async (request, response) => {
    login(request, response);
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
