const request = require('supertest');
const app = require('../app');
const Assignment = require('../models/assignment');
const Submission = require('../models/submission');
const User = require('../models/user');

describe('Submission & Plagiarism', () => {
  test('student submits and plagiarism is computed', async () => {
    // create professor
    await request(app).post('/api/auth/register').send({ name: 'Prof', email: 'prof@example.com', password: 'p', role: 'professor' });
    const loginProf = await request(app).post('/api/auth/login').send({ email: 'prof@example.com', password: 'p' });
    const profToken = loginProf.body.token;

    // create assignment
    const asgRes = await request(app).post('/api/professor/assignment').set('Authorization', `Bearer ${profToken}`).send({ title: 'Essay 1', description: 'Write about X' });
    expect(asgRes.statusCode).toBe(201);
    const asgId = asgRes.body._id || asgRes.body.id;

    // create student and submit
    await request(app).post('/api/auth/register').send({ name: 'Student', email: 's@example.com', password: 'p', role: 'student' });
    const loginStudent = await request(app).post('/api/auth/login').send({ email: 's@example.com', password: 'p' });
    const studentToken = loginStudent.body.token;

    const sub1 = await request(app).post('/api/student/submit').set('Authorization', `Bearer ${studentToken}`).field('assignment_id', asgId).field('content', 'This is a unique submission about apples');
    expect(sub1.statusCode).toBe(201);
    // legacy field kept, and relatability metrics are saved on the submission
    expect(sub1.body.plagiarism_score).toBeDefined();
    expect(sub1.body.plagiarism_score).toBe(0);

    // submit a similar text (still compares to assignment description, not other students)
    const sub2 = await request(app).post('/api/student/submit').set('Authorization', `Bearer ${studentToken}`).field('assignment_id', asgId).field('content', 'This is a unique submission about apples and oranges');
    expect(sub2.statusCode).toBe(201);
    expect(typeof sub2.body.plagiarism_score).toBe('number');

    // professor can query relatability report for a specific submission
    const subsForProf = await request(app).get('/api/professor/submissions').set('Authorization', `Bearer ${profToken}`);
    expect(subsForProf.statusCode).toBe(200);
    expect(subsForProf.body.length).toBeGreaterThanOrEqual(2);

    const lastSub = subsForProf.body[0];
    const plagiarismRes = await request(app).get(`/api/professor/plagiarism/${lastSub._id}`).set('Authorization', `Bearer ${profToken}`);
    expect(plagiarismRes.statusCode).toBe(200);
    expect(plagiarismRes.body.report).toBeDefined();
    expect(plagiarismRes.body.report.relatability_score).toBeDefined();

    // professor can mark a submission directly
    const markRes = await request(app).post(`/api/professor/mark/${lastSub._id}`).set('Authorization', `Bearer ${profToken}`).send({ professor_mark: 85, professor_comment: 'Good work' });
    expect(markRes.statusCode).toBe(200);
    expect(markRes.body.final_mark).toBe(85);
  });
});