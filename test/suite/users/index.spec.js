const jwt = require('jsonwebtoken');

const api = require('../../../src/users');
const {config: {auth: {jwtKey}}} = require('../../../src/utils');

const JWT_OBJ = {email: 'test@test.com', isAdmin: false, ua: 'test', ip: 'localhost', firstname: 'joe', lastname: 'blogs', id: 1};
const JWT_TOKEN = jwt.sign(JWT_OBJ, jwtKey);

describe ('users module tests', () => {
  context ('with validateEmail', ()=> {
    let request, response;

    beforeEach (() => {
      request = {
        body: {
          email: 'test@test.com',
        }
      };
      response = {
        json: sinon.spy()
      };
    });

    it ('should not validate with email taken', async () => {
      await api.validateEmail(request, response);

      expect(response.json).to.have.been.calledWith({success: false, error: 'Email already taken.'});
    });

    it ('should validate email', async () => {
      request.body.email = 'not-taken';
      await api.validateEmail(request, response);

      expect(response.json).to.have.been.calledWith({success: true});
    });
  });

  context ('with signup', () => {
    let request, response;

    beforeEach (() => {
      request = {
        body: {firstname: 'a', lastname: 'a', mobile: '123', email: 'a', password: 'test'}
      };
      response = {
        json: sinon.spy()
      };
    });

    it ('should not pass validation', async () => {
      request.body.email = null;
      await api.signup(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.false();
    });

    it ('should throw duplicate error', async () => {
      request.body.firstname = 'error';
      await api.signup(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.false();
      expect(args.error).to.be.equal('User already exists.');
    });

    it ('should fail to create user', async () => {
      request.body.firstname = 'fail';
      await api.signup(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.false();
      expect(args.error).to.be.equal('Unable to create user.');
    });

    it ('should sign up successfully', async () => {
      await api.signup(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.true();
    });
  });

  context ('with requestPasswordReset', () => {
    let request, response;

    beforeEach (() => {
      request = {
        body: {email: 'test@test.com'}
      };
      response = {
        json: sinon.spy()
      };
    });

    it ('should send email', async () => {
      await api.requestPasswordReset(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.true();
    });

    it ('should not find user', async () => {
      request.body.email = 'fail';
      await api.requestPasswordReset(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.false();
      expect(args.error).to.equal('Invalid user.');
    });

    it ('should error sending email', async () => {
      request.body.email = 'error';
      await api.requestPasswordReset(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.false();
      expect(args.error).to.equal('Error sending email.');
    });

    it ('should fail sending email', async () => {
      request.body.email = 'test';
      await api.requestPasswordReset(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.false();
      expect(args.error).to.equal('Could not send email.');
    });

    it ('should error on tokenisation', async () => {
      request.body.email = 'test2@test.com';
      await api.requestPasswordReset(request, response);
      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.false();
      expect(args.error).to.equal('Tokenisation failed.');
    });
  });

  context ('with validateResetPassword', () => {
    let request, response;

    beforeEach (() => {
      request = {
        params: {
          token: 'test'
        },
        body: {
          email: 'test'
        }
      };
      response = {
        json: sinon.spy()
      };
    });

    it ('should validate token', async () => {
      await api.validateResetPassword(request, response);

      expect (response.json).to.be.calledWith({success: true, email: 'test'});
    });

    it ('should not validate token', async () => {
      request.params.token = 'fail';
      await api.validateResetPassword(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'Invalid token.'});
    });
  });

  context ('with resetPassword', () => {
    let request, response;

    beforeEach (() => {
      request = {
        params: {
          token: 'test'
        },
        body: {
          email: 'test',
          password: 'test'
        }
      };
      response = {
        json: sinon.spy()
      };
    });

    it ('should reset password', async () => {
      await api.resetPassword(request, response);

      expect (response.json).to.be.calledWith({success: true});
    });

    it ('should fail on token', async () => {
      request.params.token = 'fail';
      await api.resetPassword(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'Invalid token and email.'});
    });

    it ('should fail on reset', async () => {
      request.body.email = 'error';
      await api.resetPassword(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'error'});
    });
  });

  context ('with fetchProfile', () => {
    let request, response;

    beforeEach (() => {
      request = {
        headers: {
          authorization: JWT_TOKEN
        }
      };
      response = {
        json: sinon.spy()
      };
    });

    it ('should fetch profile', async () => {
      await api.fetchProfile(request, response);

      expect (response.json).to.be.calledWith({success: true, data: {email: 'test'}});
    });

    it ('should not find profile', async () => {
      const token = Object.assign(JWT_OBJ, {id: 2})
      request.headers.authorization = jwt.sign(token, jwtKey);
      await api.fetchProfile(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'User not found.'});
    });

    it ('should fail profile request', async () => {
      const token = Object.assign(JWT_OBJ, {id: 3})
      request.headers.authorization = jwt.sign(token, jwtKey);
      await api.fetchProfile(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'error'});
    });
  });

  context ('with updateProfile', () => {
    let request, response;

    beforeEach (() => {
      request = {
        body: {firstname: 'a', lastname: 'a', email: 'a', mobile: 'a'},
        headers: {
          authorization: JWT_TOKEN
        }
      };
      response = {
        json: sinon.spy()
      };
    });

    it ('should update profile', async () => {
      await api.updateProfile(request, response);

      expect (response.json).to.be.calledWith({success: true});
    });

    it ('should not update profile', async () => {
      const token = Object.assign(JWT_OBJ, {id: 2})
      request.headers.authorization = jwt.sign(token, jwtKey);
      await api.updateProfile(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'error'});
    });

    it ('should not update profile, invalid email', async () => {
      const token = Object.assign(JWT_OBJ, {id: 3})
      request.headers.authorization = jwt.sign(token, jwtKey);
      await api.updateProfile(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'Email already taken.'});
    });
  });

  context ('with updatePassword', () => {
    let request, response;

    beforeEach (() => {
      request = {
        body: {password: 'test', confirmPassword: 'test'},
        headers: {
          authorization: JWT_TOKEN
        }
      };
      response = {
        json: sinon.spy()
      };
    });

    it ('should update password', async () => {
      await api.updatePassword(request, response);

      expect (response.json).to.be.calledWith({success: true});
    });

    it ('should not update password, incorrect password', async () => {
      request.body.confirmPassword = 'false';
      await api.updatePassword(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'Invalid password.'});
    });

    it ('should not update password, failed request.', async () => {
      const token = Object.assign(JWT_OBJ, {id: 2})
      request.headers.authorization = jwt.sign(token, jwtKey);
      await api.updatePassword(request, response);

      expect (response.json).to.be.calledWith({success: false, error: 'error'});
    });
  });

  context ('with selectUsers', () => {
    let request, response;

    beforeEach (() => {
      request = {
        body: {password: 'test', confirmPassword: 'test'},
        headers: {
          authorization: JWT_TOKEN
        }
      };
      response = {
        json: sinon.spy(),
        status: sinon.spy()
      };
    });

    it ('should fail, not admin.', async () => {
      await api.selectUsers(request, response);

      expect(response.status).to.be.calledWith(404);
      expect(response.json).to.be.calledWith({success: false, error: 'Not authorized.'});
    });

    it ('should not update password, failed request.', async () => {
      const token = Object.assign(JWT_OBJ, {isAdmin: true})
      request.headers.authorization = jwt.sign(token, jwtKey);
      await api.selectUsers(request, response);

      expect (response.json).to.be.calledWith({success: true, data: [{test: 'a'}]});
    });
  });
});
