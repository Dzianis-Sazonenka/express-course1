const { mongoConnect, mongoDisconnect } = require('../services/mongo');
const { loadPlanetsData } = require('../models/planets.schema');
const { loadLaunchData } = require('../models/launches.model');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGO_URL = 'mongodb://localhost:27017/nasa-test';

// Global test setup
beforeAll(async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
}, 30000);

// Global test teardown
afterAll(async () => {
  await mongoDisconnect();
});
