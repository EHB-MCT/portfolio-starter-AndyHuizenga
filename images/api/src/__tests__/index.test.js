// index.test.js
const request = require('supertest');
const { app, server } = require('../index');

afterAll((done) => {
  server.close(done);
});

describe('Express API tests', () => {
  it('should return "Hello, World!" on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('hello world');
  });

  it('should return OSC data on GET /oscdata', async () => {
    const response = await request(app).get('/oscdata');
    expect(response.status).toBe(200);

  });
});


