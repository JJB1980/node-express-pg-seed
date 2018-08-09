const passwordHash = require('password-hash');
const uuid = require('uuid');

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

const {dataApi} = require('../data');
const {config} = require('../utils');
const {sendMail} = require('../utils/mail');
const {getDecodedJwt, validatePassword} = require('../auth/common');

async function validateEmail (request, response) {
  const {email} = request.body;
  try {
    const result = await dataApi(USER_VALIDATE_EMAIL, [email], request);
    if (result.length) {
      response.json({success: false, error: 'Email already taken.'});
    } else {
      response.json({success: true});
    }
  } catch (error) {
    response.json({success: false, error: error.message});
  }
}

async function signup (request, response) {
  const {firstname, lastname, mobile, email, password} = request.body;
  if (!firstname || !lastname || !mobile || !email || !password) {
    response.json({success: false, error: 'Required fields not complete.'});
    return;
  }
  const hashedPassword = passwordHash.generate(password);
  try {
    const result = await dataApi(USER_INSERT, [firstname, lastname, mobile, email, hashedPassword], request);
    if (result) {
      response.json({success: true});
    } else {
      response.json({success: false, error: 'Unable to create user.'});
    }
  } catch (error) {
    const errorString = error.message;
    if (errorString.indexOf('duplicate key') >= 0) {
      response.json({success: false, error: 'User already exists.'});
    } else {
      response.json({success: false, error: errorString});
    }
  }
}

async function requestPasswordReset (request, response) {
  const {email} = request.body;
  try {
    const result = await dataApi(USER_SELECT, [email], request);
    if (result.length) {
      const token = uuid();
      const url = `${config.host}/resetPassword/${token}`;
      const mailResult = await sendMail(email, 'Reset password.', `<a href="${url}">Reset password</a>.`);
      // console.log('mailResult :::', mailResult);
      if (mailResult.success) {
        const queryResult = await dataApi(USER_REQUEST_RESET_PASSWORD, [token, email], request);
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
    // console.log('error :::', error);
    response.json({success: false, error: 'Error sending email.'});
  }
}

async function validateResetPassword (request, response) {
  const {token} = request.params;
  const {email} = request.body;
  const result = await dataApi(USER_VALIDATE_PASSWORD_RESET_TOKEN, [token, email], request);
  if (result.length) {
    const {email} = result[0];
    response.json({success: true, email});
  } else {
    response.json({success: false, error: 'Invalid token.'});
  }
}

async function resetPassword (request, response) {
  const {token} = request.params;
  const {email, password} = request.body;
  try {
    const tokenResult = await dataApi(USER_VALIDATE_PASSWORD_RESET_TOKEN, [token, email], request);
    if (tokenResult.length && tokenResult[0].email === email) {
      const hashedPassword = passwordHash.generate(password);
      await dataApi(USER_RESET_PASSWORD, [hashedPassword, email], request);
      response.json({success: true});
    } else {
      response.json({success: false, error: 'Invalid token and email.'});
    }
  } catch (error) {
    response.json({success: false, error: error.message});
  }
}

async function fetchProfile (request, response) {
  const {id} = getDecodedJwt(request);
  try {
    const result = await dataApi(USER_SELECT_PROFILE, [id], request);
    if (result.length) {
      response.json({success: true, data: {...result[0]}})
    } else {
      response.json({success: false, error: 'User not found.'})
    }
  } catch (error) {
    response.json({success: false, error: error.message})
  }
}

async function updateProfile (request, response) {
  const {id} = getDecodedJwt(request);
  const {firstname, lastname, email, mobile} = request.body;
  try {
    const result = await dataApi(USER_EMAIL_OK_UPDATE, [email, id], request);
    if (result.length) {
      response.json({success: false, error: 'Email already taken.'})
      return;
    }
    await dataApi(USER_UPDATE_PROFILE, [firstname, lastname, email, mobile, id], request);
    response.json({success: true});
  } catch (error) {
    response.json({success: false, error: error.message})
  }
}

async function updatePassword (request, response) {
  const {password, confirmPassword} = request.body;
  const {email, id} = getDecodedJwt(request);
  try {
    const result = await dataApi(USER_SELECT, [email], request);
    const {password: verifyPassword} = result[0];
    if (!validatePassword(confirmPassword, verifyPassword)) {
      response.json({success: false, error: 'Invalid password.'})
      return;
    }
    const hashedPassword = passwordHash.generate(password);
    await dataApi(USER_UDPATE_PASSWORD, [hashedPassword, id], request);
    response.json({success: true});
  } catch (error) {
    response.json({success: false, error: error.message})
  }
}

async function selectUsers (request, response) {
  try {
    const {isAdmin} = getDecodedJwt(request);
    if (!isAdmin) {
      response.status(404);
      response.json({success: false, error: 'Not authorized.'});
      return;
    }
    const users = await dataApi(USERS_SELECT, [], request);
    response.json({success: true, data: users})
  } catch (error) {
    response.json({success: false, error: error.message})
  }
}

module.exports = {
  signup,
  requestPasswordReset,
  validateEmail,
  validateResetPassword,
  resetPassword,
  fetchProfile,
  updateProfile,
  updatePassword,
  selectUsers
};
