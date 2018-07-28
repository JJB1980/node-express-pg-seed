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
        json: sinon.spy(),
        status: sinon.spy()
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
});
