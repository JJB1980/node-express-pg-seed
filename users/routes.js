const passwordHash = require('password-hash');

const {INSERT_USER} = require('../database/sql');
const {query} = require('../database/');

function userRoutes (app) {
  app.post('/user/signup', async (request, response) => {
    const {firstName, lastName, mobile, email, password} = request.body;
    const hashedPassword = passwordHash.generate(password);
    try {
      const result = await query(INSERT_USER, [firstName, lastName, mobile, email, hashedPassword]);
      if (result) {
        response.json({success: true});
      } else {
        response.json({success: false, error: 'Unable to create user.'});
      }
    } catch (error) {
      const errorString = error.toString();
      if (errorString.indexOf('duplicate key') >= 0) {
        response.json({success: false, error: 'User already exists.'});
      } else {
        response.json({success: false, error: errorString});
      }
    }
  });
}

module.exports = {
  userRoutes
};
