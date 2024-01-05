const request = require('supertest');
const { app, closeServer } = require('../index');

describe('GET /', () => {
  test('responds with "hello world"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('hello world');
  });
});

// describe('GET /api/phones', () => {
//   test('responds with a list of phones', async () => {
//     const response = await request(app).get('/api/phones');
//     expect(response.statusCode).toBe(200);
//     // Add more assertions based on your expected response
//   });
// });

afterAll(() => {
    closeServer();
  });


