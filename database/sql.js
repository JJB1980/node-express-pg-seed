const SELECT_USER = 'select * from users where email = $1;';
const INSERT_USER = 'insert into users (firstname, lastname, mobile, email, password) values ($1, $2, $3, $4, $5);';

module.exports = {
  SELECT_USER,
  INSERT_USER
};
