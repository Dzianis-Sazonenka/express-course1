const request = require('supertest');
const app = require('../app');
const { Planet } = require('../models/planets.schema');

// Import setup to ensure database connection
require('./setup');

describe('Planets API', () => {

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
        expect(planet).toHaveProperty('kepoi_name');
        expect(planet).toHaveProperty('koi_disposition');
        expect(planet.koi_disposition).toBe('CONFIRMED');
        expect(planet.koi_insol).toBeGreaterThan(0.36);
        expect(planet.koi_insol).toBeLessThan(1.11);
        expect(planet.koi_prad).toBeLessThan(1.6);
      });
    });

    test('It should return planets with correct schema fields', async () => {
      const response = await request(app).get('/planets');
      
      if (response.body.planets.length > 0) {
        const planet = response.body.planets[0];
        expect(planet).toHaveProperty('kepid');
        expect(planet).toHaveProperty('kepoi_name');
        expect(planet).toHaveProperty('koi_disposition');
        expect(planet).toHaveProperty('koi_prad');
        expect(planet).toHaveProperty('koi_insol');
        expect(planet).toHaveProperty('ra');
        expect(planet).toHaveProperty('dec');
        expect(typeof planet.kepid).toBe('number');
        expect(typeof planet.koi_prad).toBe('number');
        expect(typeof planet.koi_insol).toBe('number');
      }
    });
  });
});
