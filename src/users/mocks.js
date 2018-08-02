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
} = require('../data/actions');

function mockUserData (action, args) {
  switch (action) {
    case USER_SELECT:
      if (/(test@test.com|test2@test.com|error|test)/g.exec(args[0]))
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

    case USER_VALIDATE_PASSWORD_RESET_TOKEN:
      if (/(test|test2)/g.exec(args[0]))
        return [{email: args[1]}];
      else
        return [];

    case USER_RESET_PASSWORD:
      if (args[1] === 'error')
        throw new Error('error');
      else
        return [];

    case USER_SELECT_PROFILE:
      if (args[0] === 2)
        return [];
      else if (args[0] === 3)
        throw new Error('error');
      else
        return [{email: 'test'}];

    case USER_EMAIL_OK_UPDATE:
      if (args[1] === 1)
        return [];
      else if (args[1] === 2)
        throw new Error('error');
      else
        return [{email: 'a'}];

    case USER_UPDATE_PROFILE:
      return true;

    case USER_UDPATE_PASSWORD:
      if (args[1] === 2)
        throw new Error('error');
      else
        return true;

    case USERS_SELECT:
      return [{test: 'a'}];

    default:
      throw new Error('action not available');
  }
}

module.exports = {
  mockUserData
};
