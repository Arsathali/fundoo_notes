import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Auth Routes Integration', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body).to.have.property('message', 'User registered successfully');
      expect(res.body).to.have.property('user');
      expect(res.body.user).to.have.property('name', userData.name);
      expect(res.body.user).to.have.property('email', userData.email);
    });

    it('should return error for existing user', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(401);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(res.body).to.have.property('message', 'User Logged In');
      expect(res.body).to.have.property('token');
      expect(res.headers['set-cookie']).to.be.an('array');
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(res.body).to.have.property('message', 'Wrong Password');
    });
  });

  // Add tests for forget password and reset password
});