const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const {config: {auth: {jwtKey}}} = require('../../../src/utils');
const api = require('../../../src/auth');
const common = require('../../../src/auth/common');

const PASSWORD = 'test';
const JWT_OBJ = {email: 'test@test.com', isAdmin: false, ua: 'test', ip: 'localhost', firstname: 'joe', lastname: 'blogs', id: 1};
const JWT_TOKEN = jwt.sign(JWT_OBJ, jwtKey);

describe ('auth module tests', () => {
  it ('should validate password', () => {
    const hashedPassword = passwordHash.generate(PASSWORD);

    expect(common.validatePassword(PASSWORD, hashedPassword)).to.be.true();
  });

  it ('should decode jwt token', () => {
    const request = {
      headers: {authorization: JWT_TOKEN}
    };
    const decoded = common.getDecodedJwt(request);

    expect(decoded.firstname).to.equal(JWT_OBJ.firstname);
    expect(decoded.email).to.equal(JWT_OBJ.email);
  });

  context ('with login', () => {
    let request, response;

    beforeEach (() => {
      request = {
        body: {
          email: JWT_OBJ.email,
          password: 'test'
        },
        headers: {
          ['user-agent']: 'test'
        },
        ip: 'localhost'
      };
      response = {
        json: sinon.spy(),
        status: sinon.spy()
      };
    });

    it ('should fail login user with invalid email', async () => {
      request.body.email = 'fail';

      await api.login(request, response);

      expect(response.status).to.have.been.calledWith(401);
      expect(response.json).to.have.been.calledOnce();
    });

    it ('should fail login user with invalid password', async () => {
      request.body.password = 'fail';

      await api.login(request, response);

      expect(response.json).to.have.been.calledOnce();
      expect(response.status).to.have.been.calledWith(401);

      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.false();
      expect(args.error).to.equal('Invalid password.');
    });

    it ('should login user', async () => {
      await api.login(request, response);

      expect(response.json).to.have.been.calledOnce();

      const args = response.json.getCall(0).args[0];

      expect(args.success).to.be.true();
      expect(args.data.firstname).to.equal('joe');
    });
  });

  context ('with authoriseHeaders', () => {
    let request, response;

    beforeEach(() => {
      request = {
        originalUrl: 'testurl',
        ip: 'localhost',
        headers: {
          authorization: 'asdf',
          ['user-agent']: 'test'
        }
      };
      response = {
        json: sinon.spy(),
        status: sinon.spy()
      };
    });

    it ('should fail when invalid..', () => {
      api.authorizeHeader(request, response);

      expect(response.status).to.be.calledWith(401);
      expect(response.json).to.be.calledWith({error: 'Invalid token.'});
    });

    it ('should fail when no header.', () => {
      request.headers.authorization = null;

      api.authorizeHeader(request, response);

      expect(response.status).to.be.calledWith(401);
      expect(response.json).to.be.calledWith({error: 'No authorization token.'});
    });

    it ('should fail when headers dont match.', () => {
      request.headers.authorization = JWT_TOKEN;
      request.ip = 'fail';

      api.authorizeHeader(request, response);

      expect(response.status).to.be.calledWith(401);
      expect(response.json).to.be.calledWith({error: 'Config does not match.'});
    });

    it ('should pass through when whitelisted route.', () => {
      request.originalUrl ='/auth/login';

      const result = api.authorizeHeader(request, response);

      expect(result.success).to.be.true();
    });

    it ('should fail when admin route.', () => {
      request.headers.authorization = JWT_TOKEN;
      request.originalUrl = '/database';

      api.authorizeHeader(request, response);

      expect(response.status).to.be.calledWith(401);
      expect(response.json).to.be.calledWith({error: 'Unauthorized.'});
    });

    it ('should authorise.', () => {
      request.headers.authorization = JWT_TOKEN;

      const result = api.authorizeHeader(request, response);

      expect(result.success).to.be.true();
    });
  });
});
