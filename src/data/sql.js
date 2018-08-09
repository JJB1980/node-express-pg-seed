const actions = require('./actions');

module.exports = {
  [actions.USER_SELECT]: 'SELECT * FROM users WHERE email = $1;',
  [actions.USER_INSERT]: 'INSERT INTO users (firstname, lastname, mobile, email, password) VALUES ($1, $2, $3, $4, $5);',
  [actions.USER_REQUEST_RESET_PASSWORD]: 'UPDATE users SET token = $1 WHERE email = $2;',
  [actions.USER_VALIDATE_EMAIL]: 'SELECT email from users WHERE email = $1',
  [actions.USER_VALIDATE_PASSWORD_RESET_TOKEN]: 'SELECT email FROM users WHERE token = $1',
  [actions.USER_RESET_PASSWORD]: 'UPDATE users SET password = $1, token = \'\' WHERE email = $2',
  [actions.USER_SELECT_PROFILE]: 'SELECT firstname, lastname, email, admin, mobile FROM users WHERE id = $1',
  [actions.USER_UPDATE_PROFILE]: 'UPDATE users SET firstname = $1, lastname = $2, email = $3, mobile = $4 WHERE id = $5',
  [actions.USER_EMAIL_OK_UPDATE]: 'SELECT * FROM users WHERE email = $1 AND id <> $2',
  [actions.USER_UDPATE_PASSWORD]: 'UPDATE users SET password = $1 WHERE id = $2',
  [actions.USERS_SELECT]: 'SELECT id, firstname, lastname, email, mobile, admin FROM users'
};
