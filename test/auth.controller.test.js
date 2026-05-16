import { expect } from 'chai';
import sinon from 'sinon';
import * as authController from '../src/controller/auth.controller.js';
import * as authService from '../src/service/auth.service.js';

describe('Auth Controller', () => {
  let req, res, next;
  let serviceStub;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      cookie: sinon.stub().returnsThis()
    };
    next = sinon.stub();
    serviceStub = sinon.stub(authService);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should register user and return 201', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const result = { message: 'User registered successfully', user: {} };

      serviceStub.registerUser.resolves(result);

      await authController.register(req, res, next);

      expect(serviceStub.registerUser.calledWith('John Doe', 'john@example.com', 'password123')).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(result)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should call next with error on failure', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const error = new Error('Registration failed');

      serviceStub.registerUser.rejects(error);

      await authController.register(req, res, next);

      expect(next.calledWith(error)).to.be.true;
      expect(res.status.notCalled).to.be.true;
      expect(res.json.notCalled).to.be.true;
    });
  });

  describe('login', () => {
    it('should login user and return 200 with token', async () => {
      req.body = { email: 'john@example.com', password: 'password123' };
      const result = { message: 'User Logged In', token: 'jwtToken' };
      process.env.NODE_ENV = 'development';

      serviceStub.loginUser.resolves(result);

      await authController.login(req, res, next);

      expect(serviceStub.loginUser.calledWith('john@example.com', 'password123')).to.be.true;
      expect(res.cookie.calledWith('token', 'jwtToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
      })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(result)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should call next with error on failure', async () => {
      req.body = { email: 'john@example.com', password: 'password123' };
      const error = new Error('Login failed');

      serviceStub.loginUser.rejects(error);

      await authController.login(req, res, next);

      expect(next.calledWith(error)).to.be.true;
      expect(res.status.notCalled).to.be.true;
      expect(res.json.notCalled).to.be.true;
    });
  });

  // Add tests for forgetPassword and resetPassword similarly
});