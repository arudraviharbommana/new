const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signToken } = require('../middleware/auth');

function isValidEmail(email) {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email);
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password required' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'invalid email' });

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email: normalizedEmail, hashed_password: hashed, role: role || 'student' });
    await user.save();

    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'invalid email' });

    const normalizedEmail = email.toLowerCase();
    // include hashed_password when needed (it's stored with that key)
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.hashed_password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}

async function me(req, res) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  return res.status(200).json({ id: user._id, name: user.name, email: user.email, role: user.role });
}

module.exports = { register, login, me };
