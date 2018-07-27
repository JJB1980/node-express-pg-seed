const chai = require('chai');
const sinon = require('sinon');
const dirtyChai = require('dirty-chai');
const sinonChai = require("sinon-chai");

chai.use(dirtyChai);
chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;
