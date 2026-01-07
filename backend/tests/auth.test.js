const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth', () => {
  test('register -> login -> me', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({ name: 'Test', email: 't@example.com', password: 'pass123' });
    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.token).toBeDefined();

    const loginRes = await request(app).post('/api/auth/login').send({ email: 't@example.com', password: 'pass123' });
    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(meRes.statusCode).toBe(200);
    expect(meRes.body.email).toBe('t@example.com');
  });

  test('register duplicate email fails', async () => {
    await request(app).post('/api/auth/register').send({ name: 'Bob', email: 'bob@example.com', password: 'pwd' });
    const res = await request(app).post('/api/auth/register').send({ name: 'Bob2', email: 'bob@example.com', password: 'pwd' });
    expect(res.statusCode).toBe(400);
  });
});
