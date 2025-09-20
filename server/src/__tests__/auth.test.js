const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/user.model');

// Mock Passport's authenticate method
jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options, callback) => (req, res, next) => {
    // Mock successful authentication
    const user = { _id: 'testuser123', googleId: '123', name: 'Test User', email: 'test@example.com' };
    req.user = user;
    next();
  })
}));

describe('Authentication Routes', () => {
  let mongoServer;
  let agent;

  beforeAll(async () => {
    // Start an in-memory MongoDB server for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create a test user
    await User.create({
      googleId: '123',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'http://example.com/avatar.jpg'
    });

    // Create a supertest agent to maintain cookies between requests
    agent = request.agent(app);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /auth/google', () => {
    it('should redirect to Google OAuth', async () => {
      const response = await agent.get('/auth/google');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('accounts.google.com');
    });
  });

  describe('GET /auth/google/callback', () => {
    it('should redirect to frontend after successful authentication', async () => {
      const response = await agent.get('/auth/google/callback');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('http://localhost:3000');
      
      // Check if session cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => cookie.includes('connect.sid'))).toBe(true);
    });
  });

  describe('GET /auth/current_user', () => {
    it('should return current user if authenticated', async () => {
      // First authenticate
      await agent.get('/auth/google/callback');
      
      // Then test current user endpoint
      const response = await agent.get('/auth/current_user');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        googleId: '123',
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).get('/auth/current_user');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /auth/logout', () => {
    it('should log out the user and clear session', async () => {
      // First authenticate
      await agent.get('/auth/google/callback');
      
      // Then log out
      const response = await agent.get('/auth/logout');
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('http://localhost:3000');
      
      // Verify session is cleared
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => 
        cookie.includes('connect.sid') && 
        cookie.includes('Expires=Thu, 01 Jan 1970')
      )).toBe(true);
    });
  });
});
