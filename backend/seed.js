require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Assignment = require('./models/assignment');
const Submission = require('./models/submission');

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/new_dev';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  await User.deleteMany({});
  await Assignment.deleteMany({});
  await Submission.deleteMany({});

  const adminPw = await bcrypt.hash('adminpass', 10);
  const profPw = await bcrypt.hash('profpass', 10);
  const studentPw = await bcrypt.hash('studentpass', 10);

  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', hashed_password: adminPw, role: 'admin' });
  const prof = await User.create({ name: 'Professor', email: 'prof@example.com', hashed_password: profPw, role: 'professor' });
  const student = await User.create({ name: 'Student', email: 'student@example.com', hashed_password: studentPw, role: 'student' });

  const asg = await Assignment.create({ title: 'Intro Assignment', description: 'Write a short essay', deadline: new Date(Date.now() + 7*24*60*60*1000), created_by: prof._id });

  await Submission.create({ assignment_id: asg._id, student_id: student._id, content: 'This is my first submission about MERN stack.' });
  await Submission.create({ assignment_id: asg._id, student_id: student._id, content: 'Another piece of text to demonstrate plagiarism detection.' });

  console.log('Seeded users, assignment, and submissions');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
