const request = require('supertest');
const app = require('../node-api-example/server.js'); // Adjust the relative path based on your project structure

describe('Companies API', () => {
  it('GET /companies returns a 200 ok response if companies are found', async () => {
    const response = await request(app).get('/companies');
    console.log("get_response_is" , response.status)
    expect(response.status).toBe(200);
    const allcompanies = [
    { id: 1, name: 'Company A', location: 'Location A' },
    { id: 2, name: 'Company B', location: 'Location B' },
    ]
    expect(response.body).toEqual(allcompanies);
  });

  it('POST /companies returns a 400 error if name or location is missing', async () => {
    const response = await request(app)
      .post('/companies')
      .send({ location: 'Test Location' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Name and location are required' });
  });
});
