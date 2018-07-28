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
      if (args[0] === 'test@test.com')
        return [{password: passwordHash.generate('test'), admin: true, firstname: 'joe', lastname: 'blogs', id: 1}];
      else
        return [];

    default:
      return {};
  }
}

module.exports = {
  stubData
};
