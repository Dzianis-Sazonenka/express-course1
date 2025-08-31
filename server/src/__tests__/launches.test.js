const request = require('supertest');
const app = require('../app');
const { Launch } = require('../models/launches.model');

// Import setup to ensure database connection
require('./setup');

describe('Launches API', () => {
  describe('GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    test('It should return launches array', async () => {
      const response = await request(app).get('/launches');
      
      expect(response.body).toHaveProperty('launches');
      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.launches)).toBe(true);
      expect(response.body.message).toBe('All launches');
    });

    test('It should return the default launch', async () => {
      const response = await request(app).get('/launches');
      
      expect(response.body.launches.length).toBeGreaterThanOrEqual(1);
      const defaultLaunch = response.body.launches.find(launch => launch.flightNumber === 1);
      expect(defaultLaunch).toMatchObject({
        flightNumber: 1,
        mission: 'Kepler-442 b',
        rocket: 'Explorer-1',
        target: 'Kepler-442 b',
        customers: ['SpaceX', 'NASA'],
        upcoming: true,
        success: true,
      });
    });
  });

  describe('GET /launches/:id', () => {
    test('It should return launch by valid ID', async () => {
      const response = await request(app)
        .get('/launches/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        flightNumber: 1,
        mission: 'Kepler-442 b',
        rocket: 'Explorer-1',
      });
    });

    test('It should return 404 for non-existent launch', async () => {
      const response = await request(app)
        .get('/launches/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Launch not found');
    });

    test('It should return 404 for invalid ID format', async () => {
      await request(app)
        .get('/launches/invalid')
        .expect(404);
    });
  });

  describe('POST /launches', () => {
    const completeLaunchData = {
      mission: 'Mars Mission Alpha',
      rocket: 'Falcon Heavy',
      launchDate: '2024-06-15',
      target: 'Mars',
      customers: ['NASA', 'SpaceX'],
      destination: 'Mars',
    };

    test('It should create a new launch with 201 status', async () => {
      const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        mission: 'Mars Mission Alpha',
        rocket: 'Falcon Heavy',
        target: 'Mars',
        customers: ['NASA', 'SpaceX'],
        upcoming: true,
        success: true,
      });
      expect(response.body).toHaveProperty('flightNumber');
      expect(typeof response.body.flightNumber).toBe('number');
    });

    test('It should auto-increment flight numbers', async () => {
      const response1 = await request(app)
        .post('/launches')
        .send(completeLaunchData);

      const response2 = await request(app)
        .post('/launches')
        .send({
          ...completeLaunchData,
          mission: 'Mars Mission Beta',
        });

      expect(response2.body.flightNumber).toBe(response1.body.flightNumber + 1);
    });

    test('It should set default values for missing fields', async () => {
      const minimalLaunchData = {
        mission: 'Test Mission',
        rocket: 'Test Rocket',
        launchDate: '2024-12-25',
        target: 'Test Target',
        destination: 'Test Target',
      };

      const response = await request(app)
        .post('/launches')
        .send(minimalLaunchData)
        .expect(201);

      expect(response.body.customers).toEqual([]);
      expect(response.body.upcoming).toBe(true);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('flightNumber');
    });
  });

  describe('DELETE /launches/:id', () => {
    test('It should abort an existing launch', async () => {
      // First create a launch
      const createResponse = await request(app)
        .post('/launches')
        .send({
          mission: 'Test Abort Mission',
          rocket: 'Test Rocket',
          launchDate: '2024-12-25',
          target: 'Test Target',
          destination: 'Test Target',
        });

      const flightNumber = createResponse.body.flightNumber;

      // Then abort it
      const abortResponse = await request(app)
        .delete(`/launches/${flightNumber}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(abortResponse.body).toMatchObject({
        ok: true,
        message: 'Launch aborted',
      });

      // Verify the launch is aborted
      const getResponse = await request(app).get(`/launches/${flightNumber}`);
      expect(getResponse.body.upcoming).toBe(false);
      expect(getResponse.body.success).toBe(false);
    });

    test('It should return 404 for non-existent launch', async () => {
      const response = await request(app)
        .delete('/launches/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Launch not found');
    });

    test('It should return 404 for invalid ID format', async () => {
      await request(app)
        .delete('/launches/invalid')
        .expect(404);
    });
  });

  describe('Integration tests', () => {
    test('Complete CRUD workflow', async () => {
      // Create
      const createResponse = await request(app)
        .post('/launches')
        .send({
          mission: 'Integration Test Mission',
          rocket: 'Integration Rocket',
          launchDate: '2024-12-25',
          target: 'Integration Target',
          destination: 'Integration Target',
          customers: ['Test Customer'],
        });

      expect(createResponse.status).toBe(201);
      const flightNumber = createResponse.body.flightNumber;

      // Read
      const getResponse = await request(app).get(`/launches/${flightNumber}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.mission).toBe('Integration Test Mission');

      // Update (Abort)
      const deleteResponse = await request(app).delete(`/launches/${flightNumber}`);
      expect(deleteResponse.status).toBe(200);

      // Verify Update
      const verifyResponse = await request(app).get(`/launches/${flightNumber}`);
      expect(verifyResponse.body.upcoming).toBe(false);
      expect(verifyResponse.body.success).toBe(false);
    });
  });
});
