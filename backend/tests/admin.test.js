const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Admin routes', () => {
  test('admin can list and delete users', async () => {
    await request(app).post('/api/auth/register').send({ name: 'Admin', email: 'admin@example.com', password: 'p', role: 'admin' });
    const loginAdmin = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'p' });
    const adminToken = loginAdmin.body.token;

    // create a user
    const u = await request(app).post('/api/auth/register').send({ name: 'ToDelete', email: 'del@example.com', password: 'p' });

    const usersRes = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`);
    expect(usersRes.statusCode).toBe(200);
    expect(usersRes.body.some(x => x.email === 'del@example.com')).toBe(true);

    // find user id
    const toDelete = usersRes.body.find(x => x.email === 'del@example.com');
    const delRes = await request(app).delete(`/api/admin/users/${toDelete._id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.statusCode).toBe(204);

    const usersAfter = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`);
    expect(usersAfter.body.some(x => x.email === 'del@example.com')).toBe(false);
  });
});