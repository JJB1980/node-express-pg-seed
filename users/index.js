const passwordHash = require('password-hash');
const uuid = require('uuid');

const {USER_INSERT, USER_SELECT, USER_RESET_PASSWORD, USER_VALIDATE_EMAIL} = require('../database/sql');
const {query} = require('../database/');
const {sendMail} = require('../utils');
const {config} = require('../config');

async function validateEmail (request, response) {
  const {email} = request.body;
  try {
    const result = await query(USER_VALIDATE_EMAIL, [email]);
    if (result.length) {
      response.json({success: false, error: 'Email already taken.'});
    } else {
      response.json({success: true});
    }
  } catch (error) {
    response.json({success: false, error: error.toString()});
  }
}

async function signup (request, response) {
  const {firstName, lastName, mobile, email, password} = request.body;
  if (!firstName || !lastName || !mobile || !email || !password) {
    response.json({success: false, error: 'Complete all required fields.'});
    return;
  }
  const hashedPassword = passwordHash.generate(password);
  try {
    const result = await query(USER_INSERT, [firstName, lastName, mobile, email, hashedPassword]);
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
}

async function resetPassword (request, response) {
  const {email} = request.body;
  try {
    const result = await query(USER_SELECT, [email]);
    if (result.length) {
      const url = `${config.host}/home`;
      const token = uuid();
      const mailResult = await sendMail(email, 'Reset password.', `<a href="${url}/resetPassword/${token}">Reset password</a>.`);
      console.log('mailResult :::', mailResult);
      if (mailResult.success) {
        const queryResult = await query(USER_RESET_PASSWORD, [token, email]);
        if (queryResult) {
          response.json({success: true});
        } else {
          response.json({success: false, error: 'Tokenisation failed.'});
        }
      } else {
        response.json({success: false, error: 'Could not send email.'});
      }
    } else {
      response.json({success: false, error: 'Invalid user.'});
    }
  } catch (error) {
    console.log('error :::', error);
    response.json({success: false, error: 'Error sending email.'});
  }
}

module.exports = {
  signup,
  resetPassword,
  validateEmail
};
