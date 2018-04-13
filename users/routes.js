const {
  signup,
  requestPasswordReset,
  validateEmail,
  validateResetPassword,
  resetPassword
} = require('./');

function userRoutes (app) {
  app.post('/user/signup', (request, response) => {
    signup(request, response);
  });

  app.post('/user/requestPasswordReset', (request, response) => {
    requestPasswordReset(request, response);
  });

  app.post('/user/resetPassword/:token', (request, response) => {
    resetPassword(request, response);
  });

  app.post('/user/validateResetPassword/:token', (request, response) => {
    validateResetPassword(request, response);
  });

  app.post('/user/validateEmail', (request, response) => {
    validateEmail(request, response);
  });
}

module.exports = {
  userRoutes
};
