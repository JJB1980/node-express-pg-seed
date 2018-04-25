const {
  signup,
  requestPasswordReset,
  validateEmail,
  validateResetPassword,
  resetPassword,
  fetchProfile,
  updateProfile,
  updatePassword,
  selectUsers
} = require('./');

function userRoutes (app) {
  app.post('/user/register', (request, response) => {
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

  app.get('/user/fetchProfile', (request, response) => {
    fetchProfile(request, response);
  });

  app.post('/user/updateProfile', (request, response) => {
    updateProfile(request, response);
  });

  app.post('/user/updatePassword', (request, response) => {
    updatePassword(request, response);
  });

  app.get('/user/selectUsers', (request, response) => {
    selectUsers(request, response);
  });
}

module.exports = {
  userRoutes
};
