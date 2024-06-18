// tests/file.test.js
const request = require('supertest');
const { app, closeServer } = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User'); 
const File = require('../models/File'); 
const fs = require('fs');
const path = require('path');

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


  // Delete the test user if it exists
  //await User.deleteOne({ email: 'testuser@example.com' });
  // Delete the test user if it exists
  await User.deleteMany({ email: 'testuser@example.com' });
  // Drop the test database
  await mongoose.connection.dropDatabase();

  // Create a test user
  const user = new User({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
    role: 'admin'
  });

  await user.save();
});


afterAll(async () => {

  // Drop the test database
  //await mongoose.connection.dropDatabase();
  // Disconnect from the test database
  await mongoose.connection.close();
  // Close the server
  closeServer();
});

describe('File Management', () => {
  let token;
  let fileId;
  const testFilePath = path.join(__dirname, 'testfile.txt');

  beforeAll(async () => {
    // Login the test user
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    token = res.body.token;

    // Create a test file
    fs.writeFileSync(testFilePath, 'This is a test file.');
  });

  afterAll(() => {
    // Remove the test file
    fs.unlinkSync(testFilePath);
  });

  it('should upload a file', async () => {
    const res = await request(app)
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', testFilePath);
    console.log(res.body);  // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('file');
    fileId = res.body.file.filename;
    console.log(fileId)
  });

  it('should get the list of files', async () => {
    const res = await request(app)
      .get('/api/files')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should rename a file', async () => {
    const newName = 'renamedfile.txt';
    const res = await request(app)
      .put(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newName });
    
    console.log(res.body);  // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('File renamed successfully');
  });

  it('should delete a file', async () => {
    const newName = 'renamedfile.txt';
    const res = await request(app)
      .delete(`/api/files/${newName}`)
      .set('Authorization', `Bearer ${token}`);
      
    console.log(res.body);  // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('File deleted successfully');
  });
});