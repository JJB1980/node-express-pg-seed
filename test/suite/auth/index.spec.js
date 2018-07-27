const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const {config: {auth: {jwtKey}}} = require('../../../utils');
const api = require('../../../auth');

const PASSWORD = 'test';
const JWT_OBJ = {email: 'test@test.com', isAdmin: true, ua: 'asdf', ip: '1', firstname: 'joe', lastname: 'blogs', id: 1};
const JWT_TOKEN = jwt.sign(JWT_OBJ, jwtKey);

describe ('auth module tests', () => {
  it ('should validate password', () => {
    const hashedPassword = passwordHash.generate(PASSWORD);

    expect(api.validatePassword(PASSWORD, hashedPassword)).to.be.true();
  });

  it ('should decode jwt token', () => {
    const request = {
      headers: {authorization: JWT_TOKEN}
    };
    const decoded = api.getDecodedJwt(request);

    expect(decoded.firstname).to.equal(JWT_OBJ.firstname);
    expect(decoded.email).to.equal(JWT_OBJ.email);
  });

  it ('should login user', async () => {
    const request = {
      body: {
        email: 'test@test.com',
        password: 'test'
      },
      headers: {
        ['user-agent']: 'test'
      },
      ip: 'localhost'
    };
    let response = {
      json: sinon.spy()
    };
    await api.login(request, response);

    expect(response.json).to.have.been.calledOnce();
  });

  it ('should fail login user', async () => {
    const request = {
      body: {
        email: 'test@test.com',
        password: 'fail-password'
      },
      headers: {
        ['user-agent']: 'test'
      },
      ip: 'localhost'
    };
    let response = {
      json: sinon.spy(),
      status: sinon.spy()
    };
    await api.login(request, response);

    expect(response.status).to.have.been.calledWith(401);
    expect(response.json).to.have.been.calledOnce();
  });
});