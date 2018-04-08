const {signup, resetPassword, validateEmail} = require('./');

function userRoutes (app) {
  app.post('/user/signup', (request, response) => {
    signup(request, response);
  });

  app.post('/user/resetPassword', (request, response) => {
    resetPassword(request, response);
  });

  app.post('/user/validateEmail', (request, response) => {
    validateEmail(request, response);
  });
}

module.exports = {
  userRoutes
};
