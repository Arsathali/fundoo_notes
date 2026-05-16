import { expect } from 'chai';
import sinon from 'sinon';
import * as authService from '../src/service/auth.service.js';
import User from '../src/model/user.model.js';
import AppError from '../src/utils/AppError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Auth Service', () => {
  let userStub;

  beforeEach(() => {
    userStub = sinon.stub(User);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      const createdUser = { ...userData, password: hashedPassword, _id: 'userId' };

      userStub.findOne.resolves(null);
      userStub.create.resolves(createdUser);

      const bcryptStub = sinon.stub(bcrypt, 'hash').resolves(hashedPassword);

      const result = await authService.registerUser(userData.name, userData.email, userData.password);

      expect(userStub.findOne.calledWith({ email: userData.email })).to.be.true;
      expect(bcryptStub.calledWith(userData.password, 10)).to.be.true;
      expect(userStub.create.calledWith({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      })).to.be.true;
      expect(result).to.deep.equal({
        message: 'User registered successfully',
        user: createdUser
      });

      bcryptStub.restore();
    });

    it('should throw error if user already exists', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const existingUser = { email: userData.email };

      userStub.findOne.resolves(existingUser);

      try {
        await authService.registerUser(userData.name, userData.email, userData.password);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.equal('User already exists');
        expect(error.statusCode).to.equal(401);
      }
    });

    it('should throw error for invalid credentials', async () => {
      try {
        await authService.registerUser('', 'john@example.com', 'password123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.equal('Invalid credentials');
        expect(error.statusCode).to.equal(401);
      }
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const loginData = { email: 'john@example.com', password: 'password123' };
      const user = { _id: 'userId', email: loginData.email, password: 'hashedPassword' };
      const token = 'jwtToken';

      userStub.findOne.resolves(user);
      const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);
      const jwtStub = sinon.stub(jwt, 'sign').returns(token);

      const result = await authService.loginUser(loginData.email, loginData.password);

      expect(userStub.findOne.calledWith({ email: loginData.email })).to.be.true;
      expect(bcryptStub.calledWith(loginData.password, user.password)).to.be.true;
      expect(jwtStub.calledWith({ userId: user._id })).to.be.true;
      expect(result).to.deep.equal({
        message: 'User Logged In',
        token
      });

      bcryptStub.restore();
      jwtStub.restore();
    });

    it('should throw error for invalid credentials', async () => {
      try {
        await authService.loginUser('', 'password123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.equal('Invalid credentials');
        expect(error.statusCode).to.equal(401);
      }
    });

    it('should throw error if user not found', async () => {
      const loginData = { email: 'john@example.com', password: 'password123' };

      userStub.findOne.resolves(null);

      try {
        await authService.loginUser(loginData.email, loginData.password);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.equal('User Not Found');
        expect(error.statusCode).to.equal(401);
      }
    });

    it('should throw error for wrong password', async () => {
      const loginData = { email: 'john@example.com', password: 'wrongpassword' };
      const user = { _id: 'userId', email: loginData.email, password: 'hashedPassword' };

      userStub.findOne.resolves(user);
      const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(false);

      try {
        await authService.loginUser(loginData.email, loginData.password);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.equal('Wrong Password');
        expect(error.statusCode).to.equal(401);
      }

      bcryptStub.restore();
    });
  });

  // Add more tests for generateResetToken and resetUserPassword if needed
});