const request = require('supertest');
const app = require('../server');

describe('Weather API', () => {
  test('GET /health should return OK status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('GET /weather/:zipCode should return 400 for invalid zip code', async () => {
    const response = await request(app).get('/weather/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid zip code format');
  });

  test('GET /weather/:zipCode should return 500 when API key is missing', async () => {
    const response = await request(app).get('/weather/90210');
    expect(response.status).toBe(500);
    expect(response.body.error).toContain('Weather API key not configured');
  });

  test('GET /nonexistent should return 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });

  test('GET /api-usage should return usage information', async () => {
    const response = await request(app).get('/api-usage');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('requestsUsed');
    expect(response.body).toHaveProperty('requestsRemaining');
    expect(response.body).toHaveProperty('maxRequests');
    expect(response.body).toHaveProperty('status');
  });
});
