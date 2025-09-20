const request = require('supertest');
const User = require('../models/user.model');

/**
 * Create an authenticated test user and return an agent with the session
 * @param {Object} app - Express app instance
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} - SuperTest agent with authenticated session
 */
const createAuthenticatedAgent = async (app, userData = {}) => {
  const agent = request.agent(app);
  
  // Create a test user
  const user = await User.create({
    googleId: 'test-' + Math.random().toString(36).substr(2, 9),
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    ...userData
  });

  // Mock authentication by directly setting the user in session
  await agent
    .post('/auth/mock-login')
    .send({ userId: user._id });

  return { agent, user };
};

/**
 * Clear all test data from the database
 */
const clearTestDatabase = async () => {
  await User.deleteMany({});
};

module.exports = {
  createAuthenticatedAgent,
  clearTestDatabase
};
