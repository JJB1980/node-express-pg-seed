const passwordHash = require('password-hash');

const {
  USER_INSERT,
  USER_SELECT,
  USER_REQUEST_RESET_PASSWORD,
  USER_VALIDATE_EMAIL,
  USER_VALIDATE_PASSWORD_RESET_TOKEN,
  USER_RESET_PASSWORD,
  USER_SELECT_PROFILE,
  USER_UPDATE_PROFILE,
  USER_EMAIL_OK_UPDATE,
  USER_UDPATE_PASSWORD,
  USERS_SELECT
} = require('../constants');

function stubData (action, args) {
  switch (action) {
    case USER_SELECT:
      if (args[0] === 'test@test.com' || args[0] === 'error' || args[0] === 'test' || args[0] === 'test2@test.com')
        return [{password: passwordHash.generate('test'), admin: true, firstname: 'joe', lastname: 'blogs', id: 1}];
      else
        return [];

    case USER_VALIDATE_EMAIL:
      if (args[0] === 'test@test.com')
        return [{user: 'taken'}]
      else
        return [];

    case USER_INSERT:
      if (args[0] === 'fail')
        return false
      else if (args[0] === 'error')
        throw new Error('duplicate key');
      else
        return true;

    case USER_REQUEST_RESET_PASSWORD:
      if (args[1] === 'test@test.com')
        return true;
      else
        return false;

    default:
      throw new Error('action not available');
  }
}

module.exports = {
  stubData
};
