const request = require('supertest');
const { app, server } = require('../index'); // Update the path based on your project structure

afterAll((done) => {
  server.close(done);
});

describe('User Registration API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  it('should handle registration errors', async () => {
    // Test for the case where registration fails, e.g., duplicate email
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com', // Use the same email as in the previous test
        password: 'testpassword',
      });

    expect(response.status).toBe(500); // You might want to adjust this based on your actual error handling
    // Add assertions for the expected error response
  });
});
