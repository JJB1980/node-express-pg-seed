const {
  USER_SELECT,
  USER_INSERT,
  USER_REQUEST_RESET_PASSWORD,
  USER_VALIDATE_EMAIL,
  USER_VALIDATE_PASSWORD_RESET_TOKEN,
  USER_RESET_PASSWORD,
  USER_SELECT_PROFILE,
  USER_UPDATE_PROFILE,
  USER_EMAIL_OK_UPDATE,
  USER_UDPATE_PASSWORD,
  USERS_SELECT
} = require('./actions');

module.exports = {
  [USER_SELECT]: 'SELECT * FROM users WHERE email = $1;',
  [USER_INSERT]: 'INSERT INTO users (firstname, lastname, mobile, email, password) VALUES ($1, $2, $3, $4, $5);',
  [USER_REQUEST_RESET_PASSWORD]: 'UPDATE users SET token = $1 WHERE email = $2;',
  [USER_VALIDATE_EMAIL]: 'SELECT email from users WHERE email = $1',
  [USER_VALIDATE_PASSWORD_RESET_TOKEN]: 'SELECT email FROM users WHERE token = $1',
  [USER_RESET_PASSWORD]: 'UPDATE users SET password = $1, token = \'\' WHERE email = $2',
  [USER_SELECT_PROFILE]: 'SELECT firstname, lastname, email, admin, mobile FROM users WHERE id = $1',
  [USER_UPDATE_PROFILE]: 'UPDATE users SET firstname = $1, lastname = $2, email = $3, mobile = $4 WHERE id = $5',
  [USER_EMAIL_OK_UPDATE]: 'SELECT * FROM users WHERE email = $1 AND id <> $2',
  [USER_UDPATE_PASSWORD]: 'UPDATE users SET password = $1 WHERE id = $2',
  [USERS_SELECT]: 'SELECT id, firstname, lastname, email, mobile, admin FROM users'
};
