const { mongoConnect, mongoDisconnect } = require('../services/mongo');
const { loadPlanetsData } = require('../models/planets.schema');
const { loadLaunchData } = require('../models/launches.model');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGO_URL = 'mongodb://localhost:27017/nasa-test';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Mock console.error to keep test output clean
const originalConsoleError = console.error;
console.error = jest.fn();

// Global test setup
beforeAll(async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
}, 30000);

// Global test teardown
afterAll(async () => {
  await mongoDisconnect();
  // Restore console.error
  console.error = originalConsoleError;
});

// Mock Passport
const mockPassport = {
  _user: { _id: 'testuser123', googleId: '123', name: 'Test User', email: 'test@example.com' },
  authenticate: jest.fn((strategy, options, callback) => (req, res, next) => {
    // Mock successful authentication
    req.user = { ...mockPassport._user };
    next();
  }),
  serializeUser: jest.fn((user, done) => done(null, user.id)),
  deserializeUser: jest.fn((id, done) => {
    done(null, { ...mockPassport._user });
  }),
  initialize: jest.fn(() => (req, res, next) => next()),
  session: jest.fn(() => (req, res, next) => next()),
  use: jest.fn(),
  _strategies: {},
  _serializers: [],
  _deserializers: [],
  _infoTransformers: [],
  _framework: {},
  _key: 'passport',
  _userProperty: 'user'
};

// Mock the entire passport module
jest.mock('passport', () => {
  const originalModule = jest.requireActual('passport');
  
  // Return a function that returns our mock
  const mockPassportFunction = function() {
    return mockPassport;
  };
  
  // Copy all properties from the original module
  Object.assign(mockPassportFunction, originalModule, mockPassport);
  
  return mockPassportFunction;
});
