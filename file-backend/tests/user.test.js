// tests/user.test.js
const request = require('supertest');
const { app, closeServer } = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User'); 

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Drop the test database
  //await mongoose.connection.dropDatabase();

  // Delete the test user if it exists
  await User.deleteMany({ email: 'testuser1@example.com' });
});

afterAll(async () => {

  // Disconnect from the test database
  await mongoose.connection.close();
  // Close the server
  closeServer();
});

describe('User Authentication', () => {
  let token;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'testuser1@example.com',
        password: 'password123',
      });
    console.log(res.body);  // Log the response body for debugging
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser1@example.com',
        password: 'password123',
      });
    console.log(res.body);  // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should get the user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);  // Log the response body for debugging
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', 'testuser1@example.com');
  });
});