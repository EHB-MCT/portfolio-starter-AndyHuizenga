// Assuming you have an Express app with a route like this:
// app.get('/hello', (req, res) => res.send('Hello, World!'));

const request = require('supertest'); // supertest is often used with Jest for HTTP testing
const app = require('../index'); // Import your Express app

test('GET /hello returns "Hello, World!"', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe('Hello, World!');
});
