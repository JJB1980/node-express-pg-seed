const USER_SELECT = 'SELECT * FROM users WHERE email = $1;';
const USER_INSERT = 'INSERT INTO users (firstname, lastname, mobile, email, password) VALUES ($1, $2, $3, $4, $5);';
const USER_RESET_PASSWORD = 'UPDATE users SET token = $1 WHERE email = $2;';

module.exports = {
  USER_SELECT,
  USER_INSERT,
  USER_RESET_PASSWORD
};
