const api = require('../../../src/users');

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
});
