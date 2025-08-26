const request = require('supertest');
const app = require('../app');
const { loadPlanetsData } = require('../models/planets.model');

describe('Planets API', () => {
  beforeAll(async () => {
    await loadPlanetsData();
  });

  describe('GET /planets', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/planets')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    test('It should return planets array and message', async () => {
      const response = await request(app).get('/planets');
      
      expect(response.body).toHaveProperty('planets');
      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.planets)).toBe(true);
      expect(response.body.message).toBe('All planets');
    });

    test('It should return habitable planets', async () => {
      const response = await request(app).get('/planets');
      
      expect(response.body.planets.length).toBeGreaterThan(0);
      
      // All returned planets should be habitable
      response.body.planets.forEach(planet => {
        expect(planet).toHaveProperty('kepler_name');
        expect(planet).toHaveProperty('koi_disposition');
        expect(planet.koi_disposition).toBe('CONFIRMED');
      });
    });
  });
});
